import { AdminPage } from '../../components/AdminPage';
import { DisplayChart, DisplayReviewData } from '../../components/admin/reviews/DisplayAdminReviews';
import { useGetAllReviews } from '../../components/admin/reviews/reviews.api';
import { Loadable } from '../../components/images-next/host/Loadable';

export default function AdminReviewPage() {
  return (
    <AdminPage title="Testimonials">
      {(jwt) => <DisplayAdminReviews jwt={jwt} />}
    </AdminPage>
  );
}

function DisplayAdminReviews({ jwt }: { jwt: string }) {
  const swr = useGetAllReviews(jwt);
  return (
    <div className="p">
      <h1 className="my-2">Alle Testimonials</h1>
      <Loadable {...swr}>
        {(curData) => (
          <>
            <DisplayChart data={curData} />
            <DisplayReviewData data={curData} />
          </>
        )}
      </Loadable>
    </div>
  );
}
