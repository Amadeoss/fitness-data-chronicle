
import Layout from "@/components/layout/Layout";
import SignupForm from "@/components/auth/SignupForm";

const Signup = () => {
  return (
    <Layout>
      <div className="max-w-md mx-auto pt-8">
        <SignupForm />
      </div>
    </Layout>
  );
};

export default Signup;
