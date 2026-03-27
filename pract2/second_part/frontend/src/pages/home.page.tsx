import UserProfile from '../components/user-profile.component';
import UsersList from '../components/users-list.component';

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
