// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Workspace.sol";

/**
 * @title WorkspaceFactory
 * @dev Factory contract for creating and managing workspaces
 */
contract WorkspaceFactory {
    address[] public allWorkspaces;
    mapping(address => address[]) public userWorkspaces;
    mapping(address => address) public workspaceOwner;

    event WorkspaceCreated(
        address indexed workspace,
        address indexed owner,
        string name,
        uint256 timestamp
    );

    /**
     * @dev Create a new workspace
     */
    function createWorkspace(
        string memory _name,
        string memory _description
    ) external returns (address) {
        Workspace newWorkspace = new Workspace(_name, _description, msg.sender);
        address workspaceAddress = address(newWorkspace);

        allWorkspaces.push(workspaceAddress);
        userWorkspaces[msg.sender].push(workspaceAddress);
        workspaceOwner[workspaceAddress] = msg.sender;

        emit WorkspaceCreated(workspaceAddress, msg.sender, _name, block.timestamp);

        return workspaceAddress;
    }

    /**
     * @dev Get all workspaces created by a user
     */
    function getUserWorkspaces(address _user) external view returns (address[] memory) {
        return userWorkspaces[_user];
    }

    /**
     * @dev Get all workspaces
     */
    function getAllWorkspaces() external view returns (address[] memory) {
        return allWorkspaces;
    }

    /**
     * @dev Get total number of workspaces
     */
    function getWorkspaceCount() external view returns (uint256) {
        return allWorkspaces.length;
    }

    /**
     * @dev Check if an address is a workspace
     */
    function isWorkspace(address _address) external view returns (bool) {
        return workspaceOwner[_address] != address(0);
    }
}
