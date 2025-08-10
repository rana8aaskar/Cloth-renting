# 👕 Cloth Rental Platform

A full-stack web application for renting and lending clothes, built with the MERN stack. Users can list their clothes for rent, browse available items, and manage rentals through an intuitive interface.

## 🌐 Live Demo

**Frontend:** [https://cloth-renting-frontend.onrender.com](https://cloth-renting-frontend.onrender.com)

**Admin Panel:** [https://cloth-renting-admin.vercel.app](https://cloth-renting-admin.vercel.app)

## ✨ Features

### 🔐 User Authentication
- Secure signup/signin with JWT tokens
- Google OAuth integration
- Profile management with avatar upload
- Role-based access control (User/Admin)

### 👔 Listing Management
- Create detailed clothing listings with multiple images
- Advanced search and filtering options
- Categories: Casual, Formal, Traditional, Sports, etc.
- Real-time availability status
- Image upload via Cloudinary

### 📦 Rental System
- Browse and rent available clothes
- Rental request management
- Status tracking (Pending, Active, Completed, Cancelled)
- Rental history and dashboard
- Real-time notifications

### 🛡️ Admin Panel
- User management and statistics
- Listing oversight and moderation
- Rental monitoring and status updates
- Dashboard with analytics
- Complete CRUD operations

## 🏗️ Architecture

```
cloth-rental/
├── client/          # Frontend React application
├── admin/           # Admin panel React application  
├── server/          # Backend Node.js/Express API
└── public/          # Static assets
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Multer** - File upload middleware

### Deployment
- **Frontend:** Render
- **Admin Panel:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Images:** Cloudinary

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB account
- Cloudinary account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rana8aaskar/Cloth-renting.git
cd cloth-rental
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Install admin dependencies**
```bash
cd ../admin
npm install
```

### Environment Variables

#### Server (.env)
```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net
PORT=3000
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

#### Client (.env)
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_API_BASE_URL=http://localhost:3000/server
```

#### Admin (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Running the Application

1. **Start the server**
```bash
cd server
npm start
```

2. **Start the client (new terminal)**
```bash
cd client
npm run dev
```

3. **Start the admin panel (new terminal)**
```bash
cd admin
npm run dev
```

The applications will be available at:
- Client: http://localhost:5173
- Admin: http://localhost:5175
- Server: http://localhost:3000

## 📊 API Endpoints

### Authentication
- `POST /server/auth/signup` - User registration
- `POST /server/auth/signin` - User login
- `POST /api/auth/admin/signin` - Admin login
- `GET /server/auth/signout` - Logout

### Listings
- `GET /server/listing/get` - Get all listings
- `POST /server/listing/create` - Create listing
- `PUT /server/listing/update/:id` - Update listing
- `DELETE /server/listing/delete/:id` - Delete listing

### Rentals
- `POST /server/rental/create` - Create rental request
- `GET /server/rental/user/:userId` - Get user rentals
- `PATCH /server/rental/:id/status` - Update rental status

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/listings` - Get all listings
- `GET /api/admin/rentals` - Get all rentals

## 👤 Default Admin Account

For testing the admin panel:
- **Email:** admin@admin.com
- **Password:** admin123

## 🎨 Key Features Details

### User Experience
- **Responsive Design:** Works seamlessly on desktop and mobile
- **Real-time Search:** Instant filtering and search results
- **Image Galleries:** Multiple images per listing with zoom
- **Notifications:** Real-time updates on rental status
- **Dark/Light Mode:** Theme switching capability

### Security
- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** bcrypt for password security
- **CORS Protection:** Configured for cross-origin requests
- **Input Validation:** Server-side validation for all inputs
- **Role-based Access:** Admin and user role separation

### Performance
- **Image Optimization:** Cloudinary for fast image delivery
- **Lazy Loading:** Images load as needed
- **Caching:** Redux state management for faster navigation
- **Pagination:** Efficient data loading for large datasets

## 🚢 Deployment

### Frontend (Render)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Admin Panel (Vercel)
1. Import GitHub repository
2. Set framework preset: `Vite`
3. Set root directory: `admin`
4. Add environment variables

### Backend (Render)
1. Connect GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aaskar Rana**
- GitHub: [@rana8aaskar](https://github.com/rana8aaskar)
- Project: [Cloth-renting](https://github.com/rana8aaskar/Cloth-renting)

## 🙏 Acknowledgments

- MongoDB for the excellent database service
- Cloudinary for image storage and optimization
- Render and Vercel for hosting services
- The React and Node.js communities for amazing tools

## 📞 Support

If you have any questions or need help with setup, feel free to open an issue in the GitHub repository.

---

⭐ If you found this project helpful, please consider giving it a star on GitHub!
