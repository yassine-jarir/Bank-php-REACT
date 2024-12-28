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

  useEffect(() => {
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
  }, []);  

  return (
    <div className="relative overflow-x-auto h-full w-full">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Nom et Prénom</th>
            <th scope="col" className="px-6 py-3">Solde</th>
            <th scope="col" className="px-6 py-3">Numéro de Compte</th>
            <th scope="col" className="px-6 py-3">limite de découvert</th>
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
                <button className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2">
                  Mettre à jour
                </button>
                <button className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-2">
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BuisnessAccount;