import {useRouter} from 'next/router';
import CompleteEmailVerification from './components/complete-email-verification';
import ResetPassword from './components/reset-password';

export default function Action() {
  const router = useRouter();
  const {mode} = router.query;

  if (mode === 'verifyEmail') {
    return <CompleteEmailVerification />;
  }

  if (mode === 'resetPassword') {
    return <ResetPassword />;
  }
  return (
    <form className='flex flex-col w-96 shadow-2xl p-4 rounded-lg'>
      <div>Invalid action code</div>
    </form>
  );
}
