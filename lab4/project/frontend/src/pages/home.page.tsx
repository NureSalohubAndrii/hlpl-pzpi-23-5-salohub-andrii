import UserProfile from '../components/users/user-profile.component';
import UsersList from '../components/users/users-list.component';

const HomePage = () => {
  return (
    <>
      <section className="flex flex-col mt-10">
        <UserProfile />
        <UsersList />
      </section>
    </>
  );
};

export default HomePage;
