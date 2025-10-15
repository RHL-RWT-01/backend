import PostNode from "./PostNode";

type TreeViewProps = {
  data: Array<{
    id: number;
    author: { username: string };
    result: number;
    operation?: string;
    value?: number;
    rightOperand?: number;
    children?: any[];
  }>;
  user: any;
  refresh: () => void;
};

export default function TreeView({ data, user, refresh }: TreeViewProps) {
  return (
    <div>
      {data.map(node => (
        <PostNode key={node.id} node={node} user={user} refresh={refresh} />
      ))}
    </div>
  );
}
