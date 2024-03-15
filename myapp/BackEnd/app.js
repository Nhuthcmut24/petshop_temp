const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const bookRoutes = require('./routes/bookRoutes');
const AddBookRoutes = require('./routes/AddBookRoutes');
const AdminLoginRoutes = require('./routes/AdminLoginRoutes');
const ConfirmRoutes = require('./routes/ConfirmRoutes');
const GetInfoRoutes = require('./Routes/GetInfoRoutes');
const UpdateBookRoutes = require('./routes/UpdateBookRoutes');
const customerRoutes = require('./Routes/customerRoutes');
const staffRoutes = require('./Routes/staffRoutes');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', cartRoutes);
app.use('/api', bookRoutes);
app.use('/api', AddBookRoutes);
app.use('/api', AdminLoginRoutes);
app.use('/api', ConfirmRoutes);
app.use('/api', GetInfoRoutes);
app.use('/api', UpdateBookRoutes);
app.use('/api', customerRoutes);
app.use('/api', staffRoutes);

app.listen(port, () => {
  console.log(`Server đang lắng nghe tại http://localhost:${port}`);
});
