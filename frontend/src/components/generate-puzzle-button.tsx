import {
  Button,
  ChevronDown,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'dread-ui';
const GeneratePuzzleButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='w-full rounded-lg'>
          Generate Puzzle
          <ChevronDown className='ml-auto' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Easy</DropdownMenuItem>
        <DropdownMenuItem>Medium</DropdownMenuItem>
        <DropdownMenuItem>Hard</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { GeneratePuzzleButton };
