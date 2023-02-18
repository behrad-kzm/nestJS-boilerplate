import axios from 'axios';
// import { HttpStatus } from '@nestjs/common';

// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     throwAppError( // [TODO]
//       {
//         message: 'Server Error.',
//         code: HttpStatus.INTERNAL_SERVER_ERROR,
//       },
//       {
//         data: error.response.data,
//         status: error.response.status,
//         statusText: error.response.statusText,
//         headers: error.response.headers,
//         config: error.response.config,
//       },
//       HttpStatus.INTERNAL_SERVER_ERROR,
//     );
//   },
// );

export default axios;
