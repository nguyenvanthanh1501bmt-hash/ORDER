import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Login from './Login';
import Signup from './Signup';

const Auth = () => {
  return (
    <div className="max-w-md mx-auto mt-20 p-4 bg-white rounded-lg shadow-md">
      <Tabs defaultValue="login">
        <TabsList className="flex border-b border-gray-200 mb-4">
          <TabsTrigger
            value="login"
            className="px-4 py-2 text-gray-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="px-4 py-2 text-gray-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
          >
            SignUp
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <Signup />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
