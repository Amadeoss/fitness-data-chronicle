
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <Layout>
      <div className="max-w-md mx-auto pt-8">
        <LoginForm />
      </div>
    </Layout>
  );
};

export default Login;
