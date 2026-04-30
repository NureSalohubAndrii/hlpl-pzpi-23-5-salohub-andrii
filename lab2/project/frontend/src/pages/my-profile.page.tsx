import UserProfile from '../components/users/user-profile.component';
import { useFriends } from '../hooks/useFriends';
import { FriendList } from '../components/friends/friend-list.component';
import { IncomingRequests } from '../components/friends/incoming-requests.component';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { Users, UserPlus } from 'lucide-react';

const MyProfile = () => {
  const { friends, incomingRequests, isLoading, acceptRequest, refresh } =
    useFriends();

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20 w-full">
      <UserProfile />

      <div className="mt-8 border rounded-2xl p-6 bg-card">
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="friends" className="gap-2 cursor-pointer">
              <Users className="w-4 h-4" />
              Friends ({friends.length})
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="gap-2 relative cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Requests
              {incomingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                  {incomingRequests.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <TabsContent value="friends">
                {friends.length > 0 ? (
                  <FriendList friends={friends} onRefresh={refresh} />
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-10">
                    You don't have any friends yet.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="requests">
                {incomingRequests.length > 0 ? (
                  <IncomingRequests
                    requests={incomingRequests}
                    onAccept={acceptRequest}
                    onRefresh={refresh}
                  />
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-10">
                    No incoming friend requests.
                  </p>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default MyProfile;
