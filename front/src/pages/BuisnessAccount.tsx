import axios from "axios";
import { useEffect, useState } from "react";

interface Account {
  id: number;
  holder_name: string;
  balance: number;
  account_number: string;
  transaction_fee?: number; 
  account_type: string;
}

function BuisnessAccount() {
  const [accounts, setAccounts] = useState<Account[]>([]);  
  const [error, setError] = useState<string | null>(null);  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const fetchAccount = () => {
     axios("http://localhost:8080/?action=getAccounts&account_type=business")
      .then((response) => {
        
        if (response.data && Array.isArray(response.data)) {
          setAccounts(response.data as Account[]);  
        } else {
          setError("Invalid data format"); 
        }
      })
      .catch((err) => {
        setError("Failed to fetch data"); 
        console.error(err);
      });
  }
useEffect(() => {
  fetchAccount()
},[]
)
const handleDelete = (id : number) => {
  axios.delete(`http://localhost:8080/?action=deleteAccount&account_id=${id}`)
  
  .then((response) => {
    fetchAccount()
   setAccounts((prevAccount) => {
     return prevAccount.filter(item => item.id != id);
   })
   
   console.log("deleted succuffuly",response)
   })
  .catch((err) => {
    setError("Failed DELETE"); 
    console.error(err);
  });
}
const handleUpdate = (account: Account) => {
  setSelectedAccount(account);
  setIsModalOpen(true);
};

const handleModalClose = () => {
  setIsModalOpen(false);
  setSelectedAccount(null);
};

const handleSaveUpdate = () => {
  if (selectedAccount) {
    axios
      .put(`http://localhost:8080/?action=updateAccount&account_id=${selectedAccount.id}`, selectedAccount)
      .then((response) => {
        fetchAccount();
        setIsModalOpen(false);
        setSelectedAccount(null);
        console.log("Updated successfully", response);
      })
      .catch((err) => {
        setError("Failed to update");
        console.error(err);
      });
  }
};
  return (
    <div className="relative overflow-x-auto h-full w-full">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Nom et Prénom</th>
            <th scope="col" className="px-6 py-3">Solde</th>
            <th scope="col" className="px-6 py-3">Numéro de Compte</th>
            <th scope="col" className="px-6 py-3">frais pour chaque transaction</th>
            <th scope="col" className="px-6 py-3">Type de Compte</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {error && (
            <tr>
              <td className="text-red-600 text-center">
                {error}
              </td>
            </tr>
          )}
          {accounts.map((account) => (
            <tr
              key={account.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {account.holder_name}
              </th>
              <td className="px-6 py-4">{account.balance}€</td>
              <td className="px-6 py-4">{account.account_number}</td>
              <td className="px-6 py-4">
                {account.transaction_fee ? `${account.transaction_fee}%` : "N/A"}
              </td>
              <td className="px-6 py-4">{account.account_type}</td>
              <td className="px-6 py-4 flex space-x-2">
                <button   onClick={() => handleUpdate(account)} className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2">
                  Mettre à jour
                </button>
                <button onClick={()=> handleDelete(account.id)} className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-2">
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && selectedAccount && (
        <div className="fixed inset-0 bg-gray-500  bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 w-[600px] rounded-lg shadow-lg ">
            <h2 className="text-2xl font-semibold mb-4">Modifier le compte</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom et Prénom</label>
              <input
                type="text"
                value={selectedAccount.holder_name}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, holder_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Solde</label>
              <input
                type="number"
                value={selectedAccount.balance}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, balance: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Numéro de Compte</label>
              <input
                type="text"
                value={selectedAccount.account_number}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, account_number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">limite de découvert</label>
              <input
                type="number"
                value={selectedAccount.transaction_fee || ""}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, transaction_fee: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type de Compte</label>
              <select
                value={selectedAccount.account_type}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, account_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              >
                <option value="savings">Épargne</option>
                <option value="current">Courant</option>
                <option value="business">entreprise</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleModalClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuisnessAccount;