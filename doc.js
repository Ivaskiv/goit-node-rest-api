
//!Контролер (Controller):
// Прив'язаний до конкретних URL-адрес (маршрутів).
// Отримує req та res в якості параметрів.
// Відправляє відповідь користувачу.

// Прив'язаний до URL-адрес
router.post('/register', userController.register);

// Отримання req та res
const registerUser = async (req, res) => { ... };

// Відправлення відповіді
res.status(201).json(newUser);
//!Сервіс (Service):
// Містить бізнес-логіку та взаємодіє з базою даних.
// Часто має розділення функцій за конкретними завданнями.

// Бізнес-логіка та взаємодія з базою даних
const register = async (userData) => { ... };

// Розділення функцій за завданнями
const checkExistingUser = async (email) => { ... };
const createUser = async (userData) => { ... };

//!Мідлвара (Middleware):
//Middleware в Express.js - це функції, які обробляють запити (request) до сервера перед тим, 
//як вони досягнуть обробника(route handler) або іншої middleware.

// Викликається перед контролером і приймає третім параметром next.
// Часто використовується для перевірок, обробки даних або логіки безпеки.

// Викликається перед контролером та приймає `next`
const authToken = async (req, res, next) => { ... };

// Перевірка авторизації
if (!authHeader || !authHeader.startsWith('Bearer ')) { ... }

// Виклик `next()` для переходу до наступного middleware або контролера
next();