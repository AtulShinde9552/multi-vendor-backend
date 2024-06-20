const express = require('express');
const { dbConnect } = require('./utiles/db');
const app = express();
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const socket = require('socket.io');

dotenv.config();

const server = http.createServer(app);

app.use(cors({
    origin: process.env.mode === 'pro' ? [process.env.client_customer_production_url, process.env.client_admin_production_url] : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

const io = socket(server, {
    cors: {
        origin: process.env.mode === 'pro' ? [process.env.client_customer_production_url, process.env.client_admin_production_url] : ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true
    }
});

let allCustomer = [];
let allSeller = [];
let allAreaManagers = [];
let allRegionalAdmins = [];
let admin = {};

const addUser = (customerId, socketId, userInfo) => {
    if (!allCustomer.some(u => u.customerId === customerId)) {
        allCustomer.push({ customerId, socketId, userInfo });
    }
};

const addSeller = (sellerId, socketId, userInfo) => {
    if (!allSeller.some(u => u.sellerId === sellerId)) {
        allSeller.push({ sellerId, socketId, userInfo });
    }
};

const addAreaManager = (areaManagerId, socketId, userInfo) => {
    if (!allAreaManagers.some(u => u.areaManagerId === areaManagerId)) {
        allAreaManagers.push({ areaManagerId, socketId, userInfo });
    }
};

const addRegionalAdmin = (regionalAdminId, socketId, userInfo) => {
    if (!allRegionalAdmins.some(u => u.regionalAdminId === regionalAdminId)) {
        allRegionalAdmins.push({ regionalAdminId, socketId, userInfo });
    }
};

const findCustomer = (customerId) => allCustomer.find(c => c.customerId === customerId);
const findSeller = (sellerId) => allSeller.find(c => c.sellerId === sellerId);
const findAreaManager = (areaManagerId) => allAreaManagers.find(c => c.areaManagerId === areaManagerId);
const findRegionalAdmin = (regionalAdminId) => allRegionalAdmins.find(c => c.regionalAdminId === regionalAdminId);

const remove = (socketId) => {
    allCustomer = allCustomer.filter(c => c.socketId !== socketId);
    allSeller = allSeller.filter(c => c.socketId !== socketId);
    allAreaManagers = allAreaManagers.filter(c => c.socketId !== socketId);
    allRegionalAdmins = allRegionalAdmins.filter(c => c.socketId !== socketId);
};

const removeAdmin = (socketId) => {
    if (admin.socketId === socketId) {
        admin = {};
    }
};

io.on('connection', (soc) => {
    console.log('socket server is connected...');

    soc.on('add_user', (customerId, userInfo) => {
        addUser(customerId, soc.id, userInfo);
        io.emit('activeSeller', allSeller);
        io.emit('activeCustomer', allCustomer);
    });

    soc.on('add_seller', (sellerId, userInfo) => {
        addSeller(sellerId, soc.id, userInfo);
        io.emit('activeSeller', allSeller);
        io.emit('activeCustomer', allCustomer);
        io.emit('activeAdmin', { status: true });
        io.emit('activeAreaManager', allAreaManagers); // Emit activeAreaManager event
        io.emit('activeRegionalAdmin', allRegionalAdmins); // Emit activeRegionalAdmin event
    });

    soc.on('add_admin', (adminInfo) => {
        delete adminInfo.email;
        admin = adminInfo;
        admin.socketId = soc.id;
        io.emit('activeSeller', allSeller);
        io.emit('activeAdmin', { status: true });
    });

    soc.on('add_area_manager', (areaManagerId, userInfo) => {
        addAreaManager(areaManagerId, soc.id, userInfo);
        io.emit('activeAreaManager', allAreaManagers);
        io.emit('activeAdmin', { status: true });
    });

    soc.on('add_regional_admin', (regionalAdminId, userInfo) => {
        addRegionalAdmin(regionalAdminId, soc.id, userInfo);
        io.emit('activeRegionalAdmin', allRegionalAdmins);
        io.emit('activeAdmin', { status: true });
    });

    soc.on('send_seller_message', (msg) => {
        const customer = findCustomer(msg.receverId);
        if (customer) {
            soc.to(customer.socketId).emit('seller_message', msg);
        }
    });

    soc.on('send_customer_message', (msg) => {
        const seller = findSeller(msg.receverId);
        if (seller) {
            soc.to(seller.socketId).emit('customer_message', msg);
        }
    });

    soc.on('send_message_admin_to_seller', (msg) => {
        const seller = findSeller(msg.receverId);
        if (seller) {
            soc.to(seller.socketId).emit('receved_admin_message', msg);
        }
    });

    soc.on('send_message_seller_to_admin', (msg) => {
        if (admin.socketId) {
            soc.to(admin.socketId).emit('receved_seller_message', msg);
        }
    });

    soc.on('send_message_area_manager_to_seller', (msg) => {
        const seller = findSeller(msg.receverId);
        if (seller) {
            soc.to(seller.socketId).emit('received_area_manager_message', msg);
        }
    });

    soc.on('send_message_seller_to_area_manager', (msg) => {
        const areaManager = findAreaManager(msg.receverId);
        if (areaManager) {
            soc.to(areaManager.socketId).emit('received_seller_message', msg);
        }
    });

    soc.on('send_message_admin_to_regional_admin', (msg) => {
        const regionalAdmin = findRegionalAdmin(msg.receverId);
        if (regionalAdmin) {
            soc.to(regionalAdmin.socketId).emit('received_admin_message', msg);
        }
    });

    soc.on('send_message_regional_admin_to_admin', (msg) => {
        if (admin.socketId) {
            soc.to(admin.socketId).emit('received_regional_admin_message', msg);
        }
    });

    soc.on('disconnect', () => {
        console.log('user disconnected');
        remove(soc.id);
        removeAdmin(soc.id);
        io.emit('activeAdmin', { status: admin.socketId ? true : false });
        io.emit('activeAreaManager', allAreaManagers); // Emit activeAreaManager event after disconnect
        io.emit('activeRegionalAdmin', allRegionalAdmins); // Emit activeRegionalAdmin event after disconnect
        io.emit('activeSeller', allSeller);
        io.emit('activeCustomer', allCustomer);
    });
});

app.use(bodyParser.json());
app.use(cookieParser());

const routes = [
    './routes/chatRoutes',
    './routes/paymentRoutes',
    './routes/bannerRoutes',
    './routes/dashboard/dashboardIndexRoutes',
    './routes/home/homeRoutes',
    './routes/order/orderRoutes',
    './routes/home/cardRoutes',
    './routes/authRoutes',
    './routes/home/customerAuthRoutes',
    './routes/dashboard/sellerRoutes',
    './routes/dashboard/categoryRoutes',
    './routes/dashboard/productRoutes',
    './routes/dashboard/areamanagerRoutes',
    './routes/dashboard/regionaladminRoutes'
];

routes.forEach(route => {
    app.use('/api', require(route));
});

app.get('/', (req, res) => res.send('Hello World!'));

const port = process.env.PORT || 3000; // Default to port 3000 if PORT is not defined
dbConnect().then(() => {
    server.listen(port, () => console.log(`Server is running on port ${port}!`));
}).catch(err => {
    console.error('Failed to connect to the database', err);
});
