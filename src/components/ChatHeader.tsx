
import { Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from 'firebase/auth';
import logo from '../assets/blck.png'
import { UserInfo } from '@/lib/utils';
interface ChatHeaderProps {
  user: UserInfo;
  onSignOut: () => void;
}

const ChatHeader = ({ user, onSignOut }: ChatHeaderProps) => {
  console.log("User",user)
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center">
            <img src={logo} alt="logo" style={{width:120}}/>
          </div>
          <h1 className="text-xl font-bold hr-blue">Ask HR</h1>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                <AvatarFallback className="bg-hr-light-blue hr-blue">
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm">
              <div className="font-medium">{user.displayName || 'User'}</div>
              <div className="text-muted-foreground text-xs">{user.email}</div>
            </div>
            <DropdownMenuItem onClick={onSignOut} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ChatHeader;
