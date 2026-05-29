# RiwiFlow - Kanban Task Manager SPA

## Descripción del Proyecto

RiwiFlow es una aplicación web SPA (Single Page Application) desarrollada para la gestión de tareas mediante metodología Kanban.

El sistema permite:

* autenticación de usuarios
* gestión de tareas
* actualización de estados mediante Drag & Drop
* administración de usuarios
* control de acceso por roles

La aplicación fue construida utilizando JavaScript Vanilla, Vite y json-server simulando un entorno frontend profesional modularizado.



# Objetivo del Proyecto

El objetivo principal fue construir una SPA moderna aplicando conceptos de:

* modularización
* componentes reutilizables
* consumo de APIs
* rutas protegidas
* persistencia de sesión
* renderizado dinámico


# Estructura del Proyecto

```bash
riwiflow/
│
├── public/
│
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── router.js
│   └── main.js
│
├── db.json
├── package.json
└── index.html
```

# Instalación del Proyecto

## 1. Clonar repositorio

```bash
git clone <url-del-repositorio>
```



## 2. Instalar dependencias

```bash
npm install
```



## 3. Ejecutar json-server

```bash
npx json-server db.json
```

Servidor:

```bash
http://localhost:3000
```



## 4. Ejecutar proyecto

```bash
npm run dev
```

Aplicación:

```bash
http://localhost:5173
```



# Sistema de Autenticación

La autenticación se realiza consultando usuarios almacenados en json-server.

## Flujo:

1. Usuario ingresa email y contraseña
2. Se consulta `/users`
3. Se valida coincidencia
4. Se guarda sesión en localStorage
5. Se redirige al dashboard



# Roles de Usuario

## Admin

Puede:

* crear tareas
* editar tareas
* eliminar tareas
* gestionar usuarios

## Member

Puede:

* visualizar tareas
* mover tareas entre columnas



# Funcionalidades Principales

## CRUD de tareas

El sistema permite:

* crear tareas
* listar tareas
* actualizar tareas
* eliminar tareas



## Drag & Drop

Las tareas pueden moverse entre columnas:

* To Do
* In Progress
* In Review
* Done

Implementado usando:

* dragstart
* dragover
* drop



##  Guards de Rutas

Protegen rutas privadas.

Ejemplo:

* si no hay sesión → redirección al login
* si no es admin → acceso denegado



# API REST

json-server simula una API REST real.

## Endpoints

### Usuarios

```http
GET /users
POST /users
PATCH /users/:id
DELETE /users/:id
```

### Tareas

```http
GET /tasks
POST /tasks
PATCH /tasks/:id
DELETE /tasks/:id
```

#  Autores

- Juan Rangel
- Yaila Ustate


