## ➕ on-snip

on-snip is a real-time collaborative messaging platform built with Next.js, Express, Socket.IO, and Redis.

![on-snip logo](https://github.com/user-attachments/assets/96819d95-58ff-4b74-bbcd-eb10bfbc4621)

## Features

- Create and join instant messaging rooms
- Real-time message updates
- Persistent message storage

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, React Query
- **Backend**: Express.js, Socket.IO
- **Database**: Redis (Upstash)
- **Deployment**: Vercel (frontend), Heroku (backend)

## Local Setup

### Frontend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/SanyamPunia/on-snip.git
   cd on-snip/client
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Create a `.env` file in the client directory with the following content:

   ```bash
   UPSTASH_REDIS_REST_URL=...
   UPSTASH_REDIS_REST_TOKEN=...
   ```

4. Start the development server:

   ```bash
   yarn dev
   ```

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd ../server
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Create a `.env` file in the server directory with the following content:

   ```bash
   REDIS_CONNECTION_STRING=...
   PORT=8080
   ```

4. Start the backend server:

   ```bash
   yarn dev
   ```

## Deployment

- **Frontend**: The Next.js app is deployed on Vercel.
- **Backend**: The Express server is hosted on Heroku.

## Production

Visit [https://on-snip.org](https://on-snip.org) to see the live application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
