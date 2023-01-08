import { AdminPage } from '../../components/AdminPage';
import { DisplayChart, DisplayReviewData } from '../../components/admin/reviews/DisplayAdminReviews';
import { LoginResponse } from '../../components/admin/AdminLoginForm';
import { useGetAllReviews } from '../../components/admin/reviews/reviews.api';
import { Loadable } from '../../components/images-next/host/Loadable';

export default function AdminReviewPage() {
  return (
    <AdminPage title="Testimonials">
      {(loginData) => <DisplayAdminReviews loginData={loginData} />}
    </AdminPage>
  );
}

function DisplayAdminReviews({ loginData }: { loginData: LoginResponse }) {
  const swr = useGetAllReviews(loginData);
  return (
    <>
      <h1 className="my-2">Alle Testimonials</h1>
      <Loadable {...swr}>
        {(curData) => (
          <>
            <DisplayChart data={curData} />
            <DisplayReviewData data={curData} />
          </>
        )}
      </Loadable>
    </>
  );
}
