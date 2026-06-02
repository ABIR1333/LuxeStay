# ✦ LuxeStay Hotel Management System

> Système de gestion hôtelière moderne, premium et responsive.

---

## 🛠 Stack Technique

| Couche | Technologies |
|---|---|
| Backend | Java 17, Spring Boot 3.2, Spring Security, JWT, JPA/Hibernate |
| Base de données | MySQL 8 |
| Frontend | Angular 17 (Standalone), SCSS, Bootstrap 5 |
| Charts | Chart.js 4 |
| Auth | JWT Bearer Token |

---

## 📁 Structure du projet

```
luxestay/
├── backend/                     ← Spring Boot (Eclipse)
│   ├── pom.xml
│   └── src/main/java/com/luxestay/
│       ├── config/              SecurityConfig
│       ├── controller/          Auth, Room, Reservation, Employee, Client, Dashboard
│       ├── dto/                 auth/, room/, reservation/, employee/, dashboard/
│       ├── entity/              User, Role, Room, Client, Reservation, Employee
│       ├── exception/           ResourceNotFoundException, BadRequestException, GlobalExceptionHandler
│       ├── repository/          Tous les repos JPA
│       ├── security/            JwtUtils, JwtAuthFilter, AuthEntryPoint, UserDetailsServiceImpl
│       ├── service/             Interfaces service
│       └── serviceImpl/         Implémentations + DashboardService
├── frontend/                    ← Angular 17 (VS Code)
│   ├── src/app/
│   │   ├── core/
│   │   │   ├── guards/          auth.guard.ts
│   │   │   ├── interceptors/    jwt.interceptor.ts
│   │   │   ├── models/          auth, room, reservation, models
│   │   │   └── services/        auth, room, reservation, client, employee
│   │   ├── layouts/
│   │   │   └── main-layout/     Sidebar + Navbar
│   │   └── pages/
│   │       ├── auth/            login/, register/
│   │       ├── dashboard/
│   │       ├── rooms/
│   │       ├── reservations/
│   │       ├── clients/
│   │       ├── employees/
│   │       └── checkin/
│   └── src/styles.scss          Global premium theme
└── sql/
    └── init.sql                 Script SQL complet avec données de test
```

---

## 🚀 Lancement — Étape par étape

### Prérequis
- Java 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+ & npm
- Angular CLI 17: `npm install -g @angular/cli@17`

---

### 1. Base de données

```sql
-- Dans MySQL Workbench ou terminal MySQL :
source /chemin/vers/luxestay/sql/init.sql
```

Ou manuellement :
```bash
mysql -u root -p < sql/init.sql
```

---

### 2. Backend Spring Boot (Eclipse)

**Option A — Eclipse :**
1. `File → Import → Maven → Existing Maven Projects`
2. Sélectionner le dossier `backend/`
3. Modifier `src/main/resources/application.properties` si besoin (user/pass MySQL)
4. Clic droit sur `LuxeStayApplication.java → Run As → Spring Boot App`

**Option B — Terminal :**
```bash
cd backend
mvn spring-boot:run
```

✅ API disponible sur : `http://localhost:8080/api`

---

### 3. Frontend Angular (VS Code)

```bash
cd frontend
npm install
npm start
```

✅ Application disponible sur : `http://localhost:4200`

---

## 🔐 Comptes de connexion

| Email | Mot de passe | Rôle |
|---|---|---|
| `admin@luxestay.com` | `Admin@123` | ADMIN (accès total) |
| `receptionist@luxestay.com` | `Admin@123` | RECEPTIONNISTE |

---

## 🔌 API REST — Endpoints

### Auth
| Method | URL | Description |
|---|---|---|
| POST | `/api/auth/login` | Connexion JWT |
| POST | `/api/auth/register` | Inscription |

### Rooms
| Method | URL | Description |
|---|---|---|
| GET | `/api/rooms` | Liste des chambres |
| GET | `/api/rooms/{id}` | Détail chambre |
| GET | `/api/rooms/available?checkIn=&checkOut=` | Chambres disponibles |
| POST | `/api/rooms` | Créer chambre (ADMIN) |
| PUT | `/api/rooms/{id}` | Modifier chambre (ADMIN) |
| DELETE | `/api/rooms/{id}` | Supprimer chambre (ADMIN) |
| PATCH | `/api/rooms/{id}/status?status=` | Changer statut |

### Reservations
| Method | URL | Description |
|---|---|---|
| GET | `/api/reservations` | Toutes les réservations |
| POST | `/api/reservations` | Nouvelle réservation |
| PUT | `/api/reservations/{id}` | Modifier |
| PATCH | `/api/reservations/{id}/checkin` | Check-In |
| PATCH | `/api/reservations/{id}/checkout` | Check-Out |
| PATCH | `/api/reservations/{id}/cancel` | Annuler |

### Employees, Clients, Dashboard
- `/api/employees` — CRUD employés (ADMIN)
- `/api/clients` — CRUD clients
- `/api/clients/search?query=` — Recherche client
- `/api/dashboard/stats` — Statistiques dashboard

---

## 🎨 Fonctionnalités UI

- ✦ **Sidebar** rétractable avec navigation active
- ✦ **Navbar** premium avec horloge et profil utilisateur
- ✦ **Dashboard** avec graphique revenus (Chart.js) + statistiques
- ✦ **Tableau des chambres** avec filtres, badges statuts, équipements
- ✦ **Gestion réservations** avec check-in/out en 1 clic
- ✦ **Page Check-In/Out** dédiée avec cartes clients
- ✦ **CRUD complet** pour Clients et Employés
- ✦ **Modals** animées pour tous les formulaires
- ✦ **Toast notifications** pour le feedback
- ✦ **Responsive** mobile/tablette
- ✦ **Thème sombre premium** cohérent (gold + dark)

---

## ⚙️ Configuration `application.properties`

```properties
# Adapter selon votre environnement MySQL :
spring.datasource.url=jdbc:mysql://localhost:3306/luxestay_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root

# JWT (ne pas modifier en prod sans regénérer les tokens)
app.jwt.secret=LuxeStay@SecretKey#2025$HotelManagement!JWT@Secure256BitsKey
app.jwt.expiration=86400000   # 24h en millisecondes
```

---

## 🐛 Résolution des problèmes courants

| Problème | Solution |
|---|---|
| `Access denied for user 'root'@'localhost'` | Vérifier user/password MySQL dans `application.properties` |
| `CORS error` | Vérifier que le frontend tourne sur `http://localhost:4200` |
| `401 Unauthorized` | Token JWT expiré — se reconnecter |
| `Table doesn't exist` | Exécuter `init.sql` ou activer `spring.jpa.hibernate.ddl-auto=create` |
| `npm ERR! peer dep` | `npm install --legacy-peer-deps` |
| Port 8080 occupé | `server.port=8081` dans `application.properties` |

---

## 📌 Notes importantes

- Le mot de passe haché dans `init.sql` correspond à `Admin@123` (BCrypt)
- Pour changer le mot de passe, générer un nouveau hash BCrypt et mettre à jour la BDD
- En production : changer `app.jwt.secret` et mettre `ddl-auto=validate`
- Les images de chambres utilisent des URLs externes — remplacer par un service de stockage en production

---

*LuxeStay Hotel Management System — Développé avec Spring Boot 3 & Angular 17*
