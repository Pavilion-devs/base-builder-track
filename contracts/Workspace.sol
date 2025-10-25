// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Workspace
 * @dev Manages tasks, payments, and team members for a workspace
 */
contract Workspace {
    address public owner;
    string public name;
    string public description;
    uint256 public treasury;

    enum TaskStatus {
        Open,
        Assigned,
        Submitted,
        Completed,
        Cancelled
    }

    struct Task {
        uint256 id;
        string title;
        string descriptionHash; // IPFS hash
        address creator;
        address assignee;
        uint256 bounty;
        uint256 createdAt;
        uint256 deadline;
        TaskStatus status;
        string deliverableLink;
    }

    struct Member {
        address addr;
        string name;
        bool isActive;
        uint256 joinedAt;
    }

    mapping(uint256 => Task) public tasks;
    mapping(address => Member) public members;
    address[] public memberList;
    uint256 public taskCount;

    event TaskCreated(uint256 indexed taskId, string title, uint256 bounty, address assignee);
    event TaskAssigned(uint256 indexed taskId, address assignee);
    event TaskSubmitted(uint256 indexed taskId, string deliverableLink);
    event TaskApproved(uint256 indexed taskId, address assignee, uint256 bounty);
    event TaskCancelled(uint256 indexed taskId);
    event MemberAdded(address indexed member, string name);
    event MemberRemoved(address indexed member);
    event FundsDeposited(address indexed from, uint256 amount);
    event FundsWithdrawn(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not workspace owner");
        _;
    }

    modifier onlyMember() {
        require(members[msg.sender].isActive, "Not a workspace member");
        _;
    }

    constructor(
        string memory _name,
        string memory _description,
        address _owner
    ) {
        name = _name;
        description = _description;
        owner = _owner;

        // Add owner as first member
        members[_owner] = Member({
            addr: _owner,
            name: "Owner",
            isActive: true,
            joinedAt: block.timestamp
        });
        memberList.push(_owner);
    }

    // Receive funds
    receive() external payable {
        treasury += msg.value;
        emit FundsDeposited(msg.sender, msg.value);
    }

    /**
     * @dev Add a new member to the workspace
     */
    function addMember(address _member, string memory _name) external onlyOwner {
        require(!members[_member].isActive, "Member already exists");

        members[_member] = Member({
            addr: _member,
            name: _name,
            isActive: true,
            joinedAt: block.timestamp
        });
        memberList.push(_member);

        emit MemberAdded(_member, _name);
    }

    /**
     * @dev Remove a member from the workspace
     */
    function removeMember(address _member) external onlyOwner {
        require(members[_member].isActive, "Member not found");
        require(_member != owner, "Cannot remove owner");

        members[_member].isActive = false;
        emit MemberRemoved(_member);
    }

    /**
     * @dev Create a new task with bounty
     */
    function createTask(
        string memory _title,
        string memory _descriptionHash,
        uint256 _bounty,
        uint256 _deadline,
        address _assignee
    ) external onlyMember returns (uint256) {
        require(treasury >= _bounty, "Insufficient treasury balance");
        require(_deadline > block.timestamp, "Deadline must be in future");

        taskCount++;

        tasks[taskCount] = Task({
            id: taskCount,
            title: _title,
            descriptionHash: _descriptionHash,
            creator: msg.sender,
            assignee: _assignee,
            bounty: _bounty,
            createdAt: block.timestamp,
            deadline: _deadline,
            status: _assignee == address(0) ? TaskStatus.Open : TaskStatus.Assigned,
            deliverableLink: ""
        });

        // Lock bounty from treasury
        treasury -= _bounty;

        emit TaskCreated(taskCount, _title, _bounty, _assignee);

        return taskCount;
    }

    /**
     * @dev Claim an open task
     */
    function claimTask(uint256 _taskId) external onlyMember {
        Task storage task = tasks[_taskId];
        require(task.id != 0, "Task does not exist");
        require(task.status == TaskStatus.Open, "Task not available");

        task.assignee = msg.sender;
        task.status = TaskStatus.Assigned;

        emit TaskAssigned(_taskId, msg.sender);
    }

    /**
     * @dev Submit completed work for a task
     */
    function submitTask(uint256 _taskId, string memory _deliverableLink) external {
        Task storage task = tasks[_taskId];
        require(task.id != 0, "Task does not exist");
        require(task.assignee == msg.sender, "Not assigned to you");
        require(task.status == TaskStatus.Assigned, "Task not in correct status");

        task.deliverableLink = _deliverableLink;
        task.status = TaskStatus.Submitted;

        emit TaskSubmitted(_taskId, _deliverableLink);
    }

    /**
     * @dev Approve task and release payment
     */
    function approveTask(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        require(task.id != 0, "Task does not exist");
        require(msg.sender == task.creator || msg.sender == owner, "Not authorized");
        require(task.status == TaskStatus.Submitted, "Task not submitted");

        task.status = TaskStatus.Completed;

        // Release payment to assignee
        (bool success, ) = task.assignee.call{value: task.bounty}("");
        require(success, "Payment failed");

        emit TaskApproved(_taskId, task.assignee, task.bounty);
    }

    /**
     * @dev Cancel a task and return bounty to treasury
     */
    function cancelTask(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        require(task.id != 0, "Task does not exist");
        require(msg.sender == task.creator || msg.sender == owner, "Not authorized");
        require(task.status != TaskStatus.Completed, "Cannot cancel completed task");

        task.status = TaskStatus.Cancelled;
        treasury += task.bounty;

        emit TaskCancelled(_taskId);
    }

    /**
     * @dev Withdraw funds from treasury (owner only)
     */
    function withdrawFunds(uint256 _amount) external onlyOwner {
        require(treasury >= _amount, "Insufficient balance");

        treasury -= _amount;
        (bool success, ) = owner.call{value: _amount}("");
        require(success, "Withdrawal failed");

        emit FundsWithdrawn(owner, _amount);
    }

    /**
     * @dev Get all member addresses
     */
    function getMembers() external view returns (address[] memory) {
        return memberList;
    }

    /**
     * @dev Get task details
     */
    function getTask(uint256 _taskId) external view returns (Task memory) {
        require(tasks[_taskId].id != 0, "Task does not exist");
        return tasks[_taskId];
    }

    /**
     * @dev Get workspace balance (including locked funds)
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
