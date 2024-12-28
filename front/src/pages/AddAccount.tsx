 import axios from "axios";
import { useForm, Controller } from "react-hook-form";

type FormInputs = {
  account_number: string;
  holder_name: string;
  balance: number;
  account_type: string;
  overdraft_limit	?: number;
  interest_rate?: number;
  transaction_fee?: number;
};

function AddAccount() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      account_type: "",
    },
  });

  const selectedAccountType = watch("account_type");

  const onSubmit = (data: FormInputs) => {
    console.log(data);
    axios.post("http://localhost:8080/", data)
    .then((response) => {
      console.log(response);
    }).catch((err) => {
      console.log(err)
    }
    )
  };

  return (
    <div className="min-w-[600px] m-auto max-w-sm p-12 bg-white border border-gray-200 rounded-xl  shadow-xl dark:bg-gray-800 dark:border-gray-700">
      <form
        className="max-w-md mx-auto flex-col flex justify-center items-center h-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("account_number", {
              required: "Numéro de compte est requis",
              pattern: {
                value: /^\d+$/,
                message: "Veuillez entrer un numéro valide",
              },
            })}
            type="text"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Numero de compte
          </label>
          {errors.account_number && (
            <p className="text-red-500 text-xs mt-1">
              {errors.account_number.message}
            </p>
          )}
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("holder_name", {
              required: "Nom et prénom sont requis",
              minLength: {
                value: 2,
                message: "Le nom doit contenir au moins 2 caractères",
              },
            })}
            type="text"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Nom et Prenom
          </label>
          {errors.holder_name && (
            <p className="text-red-500 text-xs mt-1">{errors.holder_name.message}</p>
          )}
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("balance", {
              required: "Solde est requis",
              min: {
                value: 0,
                message: "Le solde ne peut pas être négatif",
              },
            })}
            type="number"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Solde
          </label>
          {errors.balance && (
            <p className="text-red-500 text-xs mt-1">{errors.balance.message}</p>
          )}
        </div>

        <div className="z-0 w-full mb-5 group">
          <label className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500">
            Type de compte
          </label>
          <Controller
            name="account_type"
            control={control}
            rules={{ required: "Veuillez sélectionner un type de compte" }}
            render={({ field }) => (
              <select
                {...field}
                className="bg-gray-50 border mt-3 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Types de comptes</option>
                <option value="current">Compte Courant</option>
                <option value="savings">Compte Épargne</option>
                <option value="business">Compte Entreprise</option>
              </select>
            )}
          />
          {errors.account_type && (
            <p className="text-red-500 text-xs mt-1">
              {errors.account_type.message}
            </p>
          )}
        </div>

        {selectedAccountType === "current" && (
          <div className="relative z-0 w-full mb-5 group">
            <input
              {...register("overdraft_limit", {
                required: "Limite de découvert est requise",
                min: {
                  value: 0,
                  message: "La limite doit être positive",
                },
              })}
              type="number"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Limite de découvert autorisée
            </label>
            {errors.overdraft_limit	
 && (
              <p className="text-red-500 text-xs mt-1">
                {errors.overdraft_limit	
.message}
              </p>
            )}
          </div>
        )}

        {selectedAccountType === "savings" && (
          <div className="relative z-0 w-full mb-5 group">
            <input
              {...register("interest_rate", {
                required: "Taux d'intérêt est requis",
                min: {
                  value: 0,
                  message: "Le taux doit être positif",
                },
                max: {
                  value: 100,
                  message: "Le taux ne peut pas dépasser 100%",
                },
              })}
              type="number"
              step="0.01"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Taux d'intérêt
            </label>
            {errors.interest_rate && (
              <p className="text-red-500 text-xs mt-1">
                {errors.interest_rate.message}
              </p>
            )}
          </div>
        )}

        {selectedAccountType === "business" && (
          <div className="relative z-0 w-full mb-5 group">
            <input
              {...register("transaction_fee", {
                required: "Frais de transaction est requis",
                min: {
                  value: 0,
                  message: "Les frais doivent être positifs",
                },
              })}
              type="number"
              step="0.01"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Frais pour chaque transaction
            </label>
            {errors.transaction_fee && (
              <p className="text-red-500 text-xs mt-1">
                {errors.transaction_fee.message}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}

export default AddAccount;