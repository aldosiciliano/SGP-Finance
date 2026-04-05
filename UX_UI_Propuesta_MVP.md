# Propuesta UX/UI MVP

## Objetivo

Definir una experiencia simple, clara y realista para `SGP Finance`, evitando complejidad innecesaria en la primera version.

La prioridad no debe ser construir un sistema financiero completo con dashboards, reportes, inversiones y multiples modulos desde el inicio. La prioridad debe ser resolver bien el flujo principal: registrar y consultar gastos personales de manera rapida.

## Criterio de producto

El MVP debe responder a esta pregunta:

`¿Puedo cargar un gasto en pocos segundos y luego encontrarlo facilmente?`

Si la respuesta es si, el producto ya cumple su objetivo inicial.

## Enfoque recomendado

### Lo que si debe incluir el MVP

- Login y registro
- Alta de gasto
- Edicion y eliminacion de gasto
- Listado de gastos
- Filtros simples por fecha y categoria
- Gestion basica de categorias
- Visualizacion de monto en ARS y referencia en USD

### Lo que no debe ser prioridad en el MVP

- Reportes avanzados
- Dashboard analitico complejo
- Modulo de inversiones
- Presupuestos
- Comparativas mensuales sofisticadas
- Graficos como pieza central de la experiencia
- Exceso de widgets financieros

## Principios de UX

### 1. Una accion principal por pantalla

Cada pantalla debe tener una accion dominante y evidente.

Ejemplos:

- En `Gastos`, la accion principal es `Agregar gasto`
- En `Categorias`, la accion principal es `Crear categoria`
- En `Login`, la accion principal es `Ingresar`

### 2. Reducir friccion

Registrar un gasto debe requerir la menor cantidad de pasos posible.

Campos recomendados:

- Monto
- Categoria
- Fecha
- Descripcion opcional

Campos avanzados o poco usados deben quedar afuera del flujo principal.

### 3. Evitar sobrecarga visual

No conviene mostrar demasiadas metricas, tarjetas, graficos y estados al mismo tiempo. Eso complica la lectura y hace que la app parezca mas dificil de usar de lo que realmente necesita ser.

### 4. Priorizar lectura y velocidad

La interfaz tiene que ayudar a:

- registrar rapido
- escanear rapido
- corregir rapido
- filtrar rapido

### 5. Mobile y desktop simples

El diseño responsive debe existir, pero sin inventar patrones complejos. Mejor una estructura estable y facil de mantener.

## Arquitectura de navegacion recomendada

La navegacion inicial deberia ser minima.

## Secciones

- `Login`
- `Gastos`
- `Categorias`
- `Configuracion`

## Secciones a dejar fuera del menu principal

- `Reportes`
- `Inversiones`
- `Presupuestos`

Si en el futuro se agregan, deberian aparecer solo cuando el flujo base ya este resuelto y probado.

## Estructura general de la app

## Desktop

- Sidebar izquierda simple
- Header liviano
- Contenido central amplio

## Mobile

- Header compacto
- Navegacion inferior o menu simple
- Boton fijo de `Agregar gasto`

## Pantallas propuestas

## 1. Login / Registro

### Objetivo

Permitir entrar sin friccion.

### Contenido

- Logo o nombre del sistema
- Campo email
- Campo password
- Boton principal
- Link para cambiar entre login y registro

### UX/UI

- Layout centrado
- Sin elementos decorativos innecesarios
- Mensajes de error claros y cortos
- Boton principal ancho y visible

## 2. Pantalla de Gastos

### Objetivo

Ser el centro real del producto.

### Estructura sugerida

#### Header

- Titulo `Gastos`
- Resumen corto del mes
- Boton principal `Agregar gasto`

#### Zona de filtros

- Filtro por fecha
- Filtro por categoria
- Busqueda opcional por descripcion

#### Zona de contenido

- Lista o tabla de gastos
- Acciones rapidas: editar y eliminar

### UX/UI

- No convertir esta pantalla en dashboard
- El resumen superior debe ser corto
- El foco visual tiene que estar en la lista y en el boton de carga
- Las acciones deben verse sin entrar a otra pantalla si no hace falta

## 3. Modal o pantalla de Nuevo Gasto

### Objetivo

Completar la carga en pocos segundos.

### Campos

- Monto
- Categoria
- Fecha
- Descripcion opcional
- Referencia en USD calculada automaticamente

### UX/UI

- Formulario corto
- Etiquetas claras
- Validaciones inmediatas
- Boton principal visible
- Boton secundario para cancelar

### Recomendacion

Si el flujo principal es muy frecuente, conviene usar modal en desktop y pantalla completa en mobile.

## 4. Pantalla de Categorias

### Objetivo

Permitir administrar categorias sin complejidad.

### Contenido

- Listado de categorias
- Crear categoria
- Editar nombre
- Elegir color
- Elegir icono simple o prescindir de iconos

### UX/UI

- No exagerar con personalizacion
- El color puede ser suficiente
- Los iconos deben ser opcionales, no obligatorios

## 5. Configuracion

### Objetivo

Agrupar opciones secundarias.

### Contenido sugerido

- Datos de usuario
- Moneda de referencia
- Preferencias basicas
- Cerrar sesion

### UX/UI

- Pantalla sobria
- Opciones separadas por bloques simples

## Pantallas que no recomiendo para el MVP

## Reportes

No deberia existir como seccion principal en esta etapa.

Motivos:

- no mejora el flujo diario
- agrega complejidad visual
- obliga a diseñar graficos, filtros y estados extra
- distrae del problema central

## Inversiones

No deberia mezclarse con gastos en la primera etapa.

Motivos:

- cambia la logica del producto
- agrega otro lenguaje visual
- introduce nuevas decisiones de informacion
- amplia demasiado el alcance

## Dashboard complejo

No conviene abrir la app con multiples tarjetas, porcentajes, comparativas y widgets.

Motivos:

- aumenta carga cognitiva
- dificulta encontrar la accion principal
- obliga a sostener mas estados de UI

## Modelo visual recomendado

## Estilo

- limpio
- sobrio
- funcional
- enfocado en legibilidad

## Componentes

- cards simples
- tabla o lista clara
- modales cortos
- botones con jerarquia evidente
- inputs grandes y faciles de usar

## Jerarquia visual

1. Accion principal
2. Contenido principal
3. Filtros
4. Datos secundarios

## Colores

Conviene una paleta contenida:

- un color principal para acciones
- neutros para fondo y texto
- colores de categorias solo como apoyo

No conviene usar demasiados colores brillantes ni mezclar estilos de dashboard financiero con app de carga diaria.

## Comportamientos UX recomendados

- Confirmacion visual al guardar
- Confirmacion antes de eliminar
- Estados vacios utiles
- Loading simple
- Mensajes de error concretos

## Ejemplos de estados vacios

### Sin gastos

`Todavia no cargaste gastos. Empeza con tu primer registro.`

### Sin categorias

`No hay categorias creadas. Crea una para organizar tus gastos.`

## Flujo ideal del usuario

1. Inicia sesion
2. Entra directo a `Gastos`
3. Ve boton claro de `Agregar gasto`
4. Carga monto, categoria y fecha
5. Guarda
6. Ve el nuevo gasto en la lista
7. Filtra o edita si hace falta

Ese flujo deberia ser mas importante que cualquier grafico o reporte.

## Decision de producto recomendada

Para este proyecto, la mejor UX/UI no es la mas completa. Es la mas facil de entender y usar.

La propuesta recomendada es construir una app centrada en:

- carga rapida
- consulta simple
- interfaz limpia
- pocas decisiones por pantalla

Y dejar para fases futuras:

- reportes
- comparativas
- inversiones
- analitica visual

## Resumen ejecutivo

`SGP Finance` deberia arrancar como una app de gastos personales simple, no como una plataforma financiera integral.

La UX/UI recomendada para el MVP es:

- una navegacion corta
- una pantalla principal de gastos
- un formulario de carga breve
- filtros basicos
- categorias simples
- sin reportes como modulo principal

Eso hace que el producto sea mas claro, mas mantenible y mucho mas facil de usar.
