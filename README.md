# Prueba Técnica para el Puesto de Líder Técnico

Bienvenido a la prueba técnica para el puesto de Líder Técnico en nuestro negocio de préstamos. Esta prueba tiene como objetivo evaluar tu capacidad para diseñar e implementar un producto mínimo viable (MVP) de backend que simule un sistema de gestión de préstamos.

## La API de producción de este proyecto puede ser encontrada en 
## Instrucciones

Debes crear una aplicación backend con las siguientes funcionalidades:

### Requisitos Funcionales

#### Crear un Usuario

- **Endpoint:** POST /usuarios
- **Descripción:** Este endpoint debe permitir la creación de un nuevo usuario en el sistema.
- **Define el Request Body y Response**

#### Crear Ofertas para un Usuario

- **Endpoint:** POST /usuarios/{userId}/ofertas
- **Descripción:** Este endpoint debe permitir la creación de un conjunto de ofertas de préstamo para un usuario específico. Las ofertas pueden variar en montos, plazos, etc. Deben crearse al menos 2 ofertas por usuario. Las ofertas solo pueden ser creadas por un administrador.
- **Define el Request Body y Response**

#### Crear un Préstamo Basado en la Oferta Seleccionada

- **Endpoint:** POST /usuarios/{userId}/prestamos
- **Descripción:** Este endpoint debe permitir la creación de un préstamo basado en una oferta seleccionada para un usuario. El préstamo debe incluir un calendario de pagos, por ejemplo, si el préstamo es a 4 semanas, se deben crear 4 entradas donde cada una corresponde a un pago esperado.
- **Define el Request Body y Response**

#### Aplicar un Pago

- **Endpoint:** POST /prestamos/{loanId}/pagos
- **Descripción:** Este endpoint debe permitir la aplicación de un pago a un préstamo existente. Al llegar al último pago, el préstamo debe marcarse como pagado. Nota: Un punto extra podría ser considerar pagos parciales. Por ejemplo, si el pago esperado es de 250 y solo se pagan 100, deben quedar 150 restantes, pero el pago sigue como pendiente.
- **Define el Request Body y Response**

### Puntos Extra

#### Agregar Autenticación a los Endpoints

Implementa un mecanismo de autenticación para todos los endpoints. Puedes usar autenticación basada en tokens (por ejemplo, JWT).

#### Crear un Endpoint para Revertir un Pago

- **Endpoint:** POST /pagos/{paymentId}/revertir
- **Descripción:** Este endpoint debe permitir la reversión de un pago aplicado anteriormente, incluyendo toda la lógica que ello conlleva.
- **Define el Request Body y Response**

### Definición de Oferta

Una oferta se entiende como el conjunto de opciones o variantes del préstamo. Por ejemplo, si decimos que un usuario tiene 2 ofertas, esto significa que tiene 2 configuraciones diferentes de préstamo, como montos y plazos distintos.

### Esquema de la Base de Datos

Debes proponer los esquemas de la base de datos para el sistema. Puedes usar SQLite y subir el archivo de la base de datos en tu entrega. Asegúrate de que tu esquema pueda manejar las funcionalidades requeridas de manera efectiva.

### Usuarios

Debes crear dos tipos de usuarios:

1. **Administrador**: Puede crear ofertas para los usuarios.
2. **Usuario**: Puede ver las ofertas y seleccionar una para crear un préstamo.

### Tiempo Esperado

El tiempo esperado para completar esta prueba es de 10 horas. Por favor, planifica tu trabajo en consecuencia.

### Pautas de Entrega

Tu código debe estar escrito en un lenguaje backend de tu elección, idealmente Node.js. Si eliges otro lenguaje, proporciona instrucciones claras sobre cómo ejecutar tu proyecto.
Haz un fork de este proyecto.
Al concluir, envíanos la liga de tu fork para poder probarlo.

¡Buena Suerte!
¡Gracias por tu participación!

