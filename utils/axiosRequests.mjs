import axios from "axios";

const GISTAXIOS = axios.create({
  baseURL:
    "https://gist.githubusercontent.com/leggant/0bba24ff5402123c0a1301df853c5541/raw/1749009d0d9ef6d14dd67939d6d5b734a2621c0c",
  method: "GET",
  responseEncoding: "json",
});

const GISTADMIN = "/admin_user.json";
const GISTBASIC = "/basic_user.json";

const getUsers = async () => {
  axios
    .all([GISTAXIOS.get(GISTADMIN), GISTAXIOS.get(GISTBASIC)])
    .then(
      axios.spread((admin, basic) => {
        console.log(admin);
        console.log(basic);
        return { admin, basic };
      }),
    )
    .catch((err) => {
      console.error(err.message);
    });
};

const quizAxios = axios.create({
  baseURL: "",
  method: "GET",
  responseEncoding: "json",
});

export { GISTAXIOS, quizAxios, getUsers };
