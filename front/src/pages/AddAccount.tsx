function AddAccount() {
  return (
    <div className="relative overflow-x-auto h-full w-full">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Nom et Prénom</th>
            <th scope="col" className="px-6 py-3">Solde</th>
            <th scope="col" className="px-6 py-3">Numéro de compte</th>
            <th scope="col" className="px-6 py-3">Taux d'intérêt</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              John Doe
            </th>
            <td className="px-6 py-4">1000€</td>
            <td className="px-6 py-4">123456789</td>
            <td className="px-6 py-4">1.5%</td>
            <td className="px-6 py-4 flex space-x-2">
              <button className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2">
                Mettre à jour
              </button>
              <button className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-2">
                Supprimer
              </button>
            </td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Jane Doe
            </th>
            <td className="px-6 py-4">2000€</td>
            <td className="px-6 py-4">987654321</td>
            <td className="px-6 py-4">2.0%</td>
            <td className="px-6 py-4 flex space-x-2">
              <button className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2">
                Mettre à jour
              </button>
              <button className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-2">
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AddAccount;
