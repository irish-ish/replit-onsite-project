import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const SessionSelect: React.FC<{
  sessions: string[];
  currentSession: string;
  onValueChange: (session: string) => void;
}> = ({ currentSession, sessions, onValueChange }) => {
  const handleSelectChange = (session: string) => {
    onValueChange(session);
  };

  return (
    <Select
      onValueChange={handleSelectChange}
      defaultValue={currentSession}
      value={currentSession}
    >
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Sessions" />
      </SelectTrigger>
      <SelectContent>
        {sessions.map((session) => (
          <SelectItem key={session} value={session}>
            {session}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
