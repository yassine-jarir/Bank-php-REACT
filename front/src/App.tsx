import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import AddCompte from './pages/AddAccount';
import SavingAccount from './pages/SavingAccount';
import BuisnessAccount from './pages/BuisnessAccount';
import CurrentAccount from './pages/CurrentAccount';
import DefaultLayout from './layout/DefaultLayout';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          path='/AddAccount'
          element={
            <>
              <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <AddCompte />
            </>
          }
        />
        <Route
          path="/SavingAccount"
          element={
            <>
              <PageTitle title="Bank | Admin" />
              <SavingAccount />
            </>
          }
        />
        <Route
          path="/BuisnessAccount"
          element={
            <>
              <PageTitle title="Bank | Admin" />
              <BuisnessAccount />
            </>
          }
        />
           <Route
          path="/CurrentAccount"
          element={
            <>
              <PageTitle title="Bank | Admin" />
              <CurrentAccount />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
