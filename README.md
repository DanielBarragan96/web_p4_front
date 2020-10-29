# web_p4_front

En esta práctica añadiremos el componente que le faltaba a las prácticas anteriores la interactividad
que nos provee JavaScript para manipular el DOM. De esta forma vamos a crear una aplicación funcional
del lado del lado del cliente (front-end). Además, ahora podremos realizar solicitudes de HTTP para
realizar operaciones de altas, bajas, cambios y consultas.

Para correr el servidor es necesario primero instalar las dependencias:

> npm install

### Criterios

1. Validación del formulario (el botón se activa cuando todo está correcto y se desactiva si no). Se marcan en rojo los que no están correctos.

2. Es posible realizar el registro del usuario al back-end. Y muestra un mensaje de usuario registrado.

3. Es posible loguearse (se guarda el token del usuario logueado en una cookie). Cuando todo es correcto me muestra un mensaje de bienvenida. En caso de error me muestra un mensaje de que ocurrió un error.

4. Al entrar a la ventana de administración de usuarios es posible visualizar los usuarios que regresa el back-end (no los que estaban de ejemplo)

5. Al dar clic en el botón de editar se abre el modal de edición con los datos precargados.

6. Es posible realizar la actualización de la información correctamente y al regresar a la ventana es posible ver el dato actualizado.

7. Es posible borrar un usuario, pero primero pregunta por confirmación de borrado.

8. Al dar clic en la lupa es posible ver el detalle del usuario (redirecciona a otro archivo html)

9. Es posible realizar el paginado (correctamente, mostrando el número de páginas correcto y activando desactivando botones prev y next) y poder realizar búsquedas por nombre.

10. El proyecto se subió a la plataforma de IBM Cloud público de modo que es accesible y funcional desde internet.
