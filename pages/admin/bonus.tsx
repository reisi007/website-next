import { AdminPage } from '../../components/AdminPage';
import { BonusProgrammLoginAdmin } from '../../components/admin/bonus/BonusProgrammLoginAdmin';

export default function Bonusprogramm() {
  return (
    <AdminPage title="Bonusprogramm">
      { (jwt) => <BonusProgrammLoginAdmin jwt={jwt} />}
    </AdminPage>
  );
}
