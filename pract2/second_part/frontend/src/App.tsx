import SignUpForm from './components/sign-up-form.component';
import { Toaster } from './components/ui/sonner';

const App = () => {
  return (
    <div className="flex justify-center mt-10">
      <SignUpForm />
      <Toaster />
    </div>
  );
};

export default App;
