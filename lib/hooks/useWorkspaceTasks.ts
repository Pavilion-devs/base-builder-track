import { useReadContract, useReadContracts } from 'wagmi';
import { WORKSPACE_ABI } from '@/lib/contracts';
import { TaskStatus } from '@/components/workspace/TaskCard';

export interface BlockchainTask {
  id: bigint;
  title: string;
  descriptionHash: string;
  creator: string;
  assignee: string;
  bounty: bigint;
  createdAt: bigint;
  deadline: bigint;
  status: number;
  deliverableLink: string;
}

export interface FormattedTask {
  id: string;
  title: string;
  description: string;
  bounty: string;
  status: TaskStatus;
  assignee?: {
    name: string;
    address: string;
  };
  deadline: string;
  deliverableLink?: string;
}

function formatTaskStatus(status: number): TaskStatus {
  switch (status) {
    case 0:
      return 'open';
    case 1:
      return 'in_progress'; // Assigned
    case 2:
      return 'submitted';
    case 3:
      return 'completed';
    case 4:
      return 'cancelled';
    default:
      return 'open';
  }
}

function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatBounty(bountyWei: bigint): string {
  const eth = Number(bountyWei) / 1e18;
  return `${eth.toFixed(4)} ETH`;
}

export function useWorkspaceTasks(workspaceAddress: string) {
  // Get task count
  const { data: taskCount, isLoading: isLoadingCount } = useReadContract({
    address: workspaceAddress as `0x${string}`,
    abi: WORKSPACE_ABI,
    functionName: 'taskCount',
  });

  const count = taskCount ? Number(taskCount) : 0;

  // Build array of task IDs to fetch
  const taskIds = Array.from({ length: count }, (_, i) => i + 1);

  // Fetch all tasks in parallel
  const { data: tasksData, isLoading: isLoadingTasks } = useReadContracts({
    contracts: taskIds.map((id) => ({
      address: workspaceAddress as `0x${string}`,
      abi: WORKSPACE_ABI,
      functionName: 'getTask',
      args: [BigInt(id)],
    })),
  });

  // Format tasks for UI
  const tasks: FormattedTask[] = tasksData
    ? tasksData
        .filter((result) => result.status === 'success' && result.result)
        .map((result) => {
          const task = result.result as unknown as BlockchainTask;
          const hasAssignee = task.assignee !== '0x0000000000000000000000000000000000000000';

          return {
            id: task.id.toString(),
            title: task.title,
            description: task.descriptionHash, // This is the description in our case
            bounty: formatBounty(task.bounty),
            status: formatTaskStatus(task.status),
            assignee: hasAssignee
              ? {
                  name: `${task.assignee.slice(0, 6)}...${task.assignee.slice(-4)}`,
                  address: task.assignee,
                }
              : undefined,
            deadline: formatDate(task.deadline),
            deliverableLink: task.deliverableLink || undefined,
          };
        })
    : [];

  return {
    tasks,
    taskCount: count,
    isLoading: isLoadingCount || isLoadingTasks,
  };
}
