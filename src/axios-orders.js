import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-burger-builder-85241.firebaseio.com/'
});

export default instance;
