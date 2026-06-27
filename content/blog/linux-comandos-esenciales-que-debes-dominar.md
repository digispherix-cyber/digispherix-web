---
title: "Los 30 comandos de Linux que todo desarrollador debe dominar"
date: "2026-06-27"
category: "Linux"
excerpt: "Conocer Linux de memoria es una ventaja enorme como desarrollador. Estos 30 comandos cubren el 90% de lo que usarás en el día a día: archivos, permisos, procesos, red y más."
readTime: "10 min"
image: "/blog/linux-comandos-esenciales-cover.jpg"
tags: ["Linux", "Terminal", "Comandos", "Desarrollo Web", "Servidores"]
---

![Los 30 comandos de Linux que todo desarrollador debe dominar](/blog/linux-comandos-esenciales-cover.jpg)

Si trabajas con servidores, haces deploy de aplicaciones web o simplemente quieres entender mejor cómo funciona la infraestructura detrás de internet, Linux es inevitable. La buena noticia: no necesitas memorizar miles de comandos. Con estos 30 dominas el 90% de las situaciones que te encontrarás en el día a día.

## ¿Por qué aprender Linux como desarrollador?

La mayoría de los servidores web del mundo corren Linux. Cuando haces deploy en AWS, Google Cloud, DigitalOcean o cualquier VPS, estás trabajando con Linux. Saber moverte en la terminal sin depender de interfaces gráficas marca la diferencia entre un desarrollador junior y uno senior.

![Comandos de Linux ejecutándose en terminal](/blog/linux-terminal-ejemplo.jpg)

## Referencia rápida — los 30 comandos

![Cheat sheet de los 30 comandos de Linux más importantes](/blog/linux-comandos-cheatsheet.jpg)

---

## Navegación y archivos

Estos son los comandos que usarás literalmente cada vez que abras una terminal.

### `ls` — Listar archivos y carpetas

```bash
ls          # Lista básica
ls -la      # Lista detallada incluyendo archivos ocultos
ls -lh      # Lista con tamaños legibles (KB, MB)
```

La bandera `-a` muestra archivos ocultos (los que empiezan con `.`). La `-l` muestra permisos, propietario, tamaño y fecha. La `-h` convierte los bytes a formato humano.

### `cd` — Cambiar de directorio

```bash
cd /var/www/html    # Ruta absoluta
cd proyecto/src     # Ruta relativa
cd ..               # Subir un nivel
cd ~                # Ir al directorio home
cd -                # Volver al directorio anterior
```

### `pwd` — Ver en qué directorio estás

```bash
pwd
# /home/usuario/proyectos/digispherix
```

Útil cuando te pierdes entre rutas largas o dentro de scripts.

### `mkdir` — Crear carpetas

```bash
mkdir proyecto
mkdir -p proyecto/src/components    # Crea toda la ruta si no existe
```

### `rm` — Eliminar archivos y carpetas

```bash
rm archivo.txt              # Elimina un archivo
rm -r carpeta/              # Elimina carpeta y su contenido
rm -rf carpeta/             # Forzado, sin preguntar confirmación
```

⚠️ **Cuidado con `rm -rf`** — no hay papelera de reciclaje en Linux. Lo que eliminas con este comando no se puede recuperar fácilmente.

### `cp` — Copiar archivos

```bash
cp archivo.txt backup/archivo.txt
cp -r carpeta/ backup/carpeta/      # Copia recursiva (carpetas)
```

### `mv` — Mover o renombrar

```bash
mv archivo.txt /var/www/            # Mueve el archivo
mv viejo.txt nuevo.txt              # Renombra el archivo
```

### `cat` — Ver contenido de un archivo

```bash
cat config.env
cat package.json
```

Para archivos largos usa `less` en su lugar — te permite hacer scroll:

```bash
less archivo-muy-largo.log
```

---

## Búsqueda

### `grep` — Buscar texto dentro de archivos

```bash
grep "error" log.txt                    # Busca "error" en un archivo
grep -r "console.log" src/              # Busca recursivamente en carpeta
grep -i "error" log.txt                 # Sin distinción mayúsculas/minúsculas
grep -n "TODO" *.js                     # Muestra el número de línea
```

`grep` es uno de los más poderosos. Combinado con pipes (`|`) es imparable:

```bash
cat error.log | grep "404" | grep "2026"    # Filtra errores 404 de 2026
```

### `find` — Buscar archivos por nombre, tipo o fecha

```bash
find . -name "*.env"                    # Todos los archivos .env
find /var -name "*.log" -type f         # Solo archivos (no carpetas)
find . -mtime -7                        # Modificados en los últimos 7 días
find . -size +10M                       # Archivos mayores a 10MB
```

---

## Permisos

### `chmod` — Cambiar permisos de archivos

```bash
chmod 755 script.sh         # rwxr-xr-x (ejecutable por todos, editable solo por propietario)
chmod 644 index.html        # rw-r--r-- (lectura para todos, edición solo propietario)
chmod +x deploy.sh          # Agrega permiso de ejecución
```

Los números representan permisos: **7** = leer+escribir+ejecutar, **5** = leer+ejecutar, **4** = solo leer.

### `chown` — Cambiar propietario

```bash
chown usuario archivo.txt
chown usuario:grupo archivo.txt
chown -R www-data:www-data /var/www/    # Recursivo, típico en servidores web
```

---

## Procesos

### `ps` — Ver procesos activos

```bash
ps aux                          # Todos los procesos del sistema
ps aux | grep nginx             # Filtrar procesos de nginx
```

### `kill` — Terminar un proceso

```bash
kill 1234           # Termina el proceso con PID 1234 (amable)
kill -9 1234        # Fuerza el cierre (cuando no responde)
```

Para encontrar el PID de un proceso por nombre:

```bash
pgrep nginx         # Devuelve el PID de nginx
pkill nginx         # Mata todos los procesos llamados nginx
```

### `top` / `htop` — Monitor de recursos en tiempo real

```bash
top                 # Viene instalado por defecto
htop                # Versión mejorada y visual (instalar con apt install htop)
```

Muestra CPU, RAM y procesos en tiempo real. Presiona `q` para salir.

---

## Disco y almacenamiento

### `df` — Espacio disponible en disco

```bash
df -h               # Muestra en formato legible (GB, MB)
```

### `du` — Tamaño de una carpeta

```bash
du -sh /var/log/            # Tamaño total de la carpeta
du -sh */                   # Tamaño de cada subcarpeta
```

Muy útil cuando el servidor se queda sin espacio y necesitas encontrar qué lo está llenando.

### `tar` — Comprimir y descomprimir

```bash
tar -czf backup.tar.gz carpeta/     # Comprimir
tar -xzf backup.tar.gz              # Descomprimir
tar -tzf backup.tar.gz              # Ver contenido sin extraer
```

---

## Red

### `ping` — Verificar conexión

```bash
ping google.com
ping 192.168.1.1        # También funciona con IPs
```

Presiona `Ctrl+C` para detenerlo.

### `curl` — Hacer peticiones HTTP desde la terminal

```bash
curl https://api.ejemplo.com/users
curl -X POST https://api.ejemplo.com/login -d '{"user":"admin"}'
curl -I https://digispherix.com.mx          # Solo headers de respuesta
```

Imprescindible para probar APIs sin salir de la terminal.

### `wget` — Descargar archivos

```bash
wget https://ejemplo.com/archivo.zip
wget -O nombre-local.zip https://ejemplo.com/archivo.zip
```

### `ifconfig` / `ip` — Información de red

```bash
ifconfig                # Versión clásica
ip addr show            # Versión moderna (preferida en sistemas actuales)
```

### `netstat` / `ss` — Ver puertos activos

```bash
netstat -tulpn          # Puertos en escucha (clásico)
ss -tulpn               # Equivalente moderno, más rápido
```

Útil para verificar si tu servidor Node, nginx o MySQL está escuchando en el puerto correcto.

### `ssh` — Conectarse a un servidor remoto

```bash
ssh usuario@192.168.1.100
ssh -p 2222 usuario@servidor.com        # Puerto personalizado
ssh -i ~/.ssh/llave.pem usuario@ip      # Con llave privada (AWS, etc.)
```

---

## Sistema y paquetes

### `sudo` — Ejecutar como administrador

```bash
sudo apt update
sudo systemctl restart nginx
sudo nano /etc/nginx/nginx.conf
```

Sin `sudo` muchos comandos de sistema devolverán "Permission denied".

### `apt` — Instalar y actualizar paquetes (Debian/Ubuntu)

```bash
sudo apt update                 # Actualiza la lista de paquetes disponibles
sudo apt upgrade                # Actualiza todos los paquetes instalados
sudo apt install nodejs         # Instala un paquete
sudo apt remove nginx           # Desinstala un paquete
```

### `systemctl` — Gestionar servicios del sistema

```bash
systemctl status nginx          # Ver estado de un servicio
systemctl start nginx           # Iniciar
systemctl stop nginx            # Detener
systemctl restart nginx         # Reiniciar
systemctl enable nginx          # Iniciar automáticamente al arrancar
```

### `nano` — Editor de texto en terminal

```bash
nano archivo.conf
```

`Ctrl+O` para guardar, `Ctrl+X` para salir. Si prefieres algo más avanzado, `vim` es la alternativa clásica (aunque tiene curva de aprendizaje).

---

## Utilidades

### `history` — Historial de comandos

```bash
history                         # Lista todos los comandos anteriores
history | grep ssh              # Filtrar por palabra clave
!!                              # Repite el último comando
!ssh                            # Repite el último comando que empezó con "ssh"
```

### `man` — Manual de cualquier comando

```bash
man grep
man chmod
man ssh
```

Cuando no recuerdes cómo usar un comando, `man` es tu mejor amigo. Presiona `q` para salir.

---

## Combinaciones que usarás todo el tiempo

El verdadero poder de Linux está en **combinar comandos con pipes** (`|`):

```bash
# Ver los 10 archivos más grandes en el directorio actual
du -sh * | sort -rh | head -10

# Buscar todos los archivos .log y contarlos
find /var/log -name "*.log" | wc -l

# Ver qué proceso está usando el puerto 3000
ss -tulpn | grep :3000

# Buscar errores en logs de las últimas 100 líneas
tail -100 /var/log/nginx/error.log | grep "502"

# Monitorear un log en tiempo real
tail -f /var/log/nginx/access.log
```

---

## Conclusión

No tienes que memorizar estos 30 comandos de un tirón. La estrategia que funciona es usarlos en situaciones reales: la próxima vez que hagas deploy en un servidor, abras una terminal o configures un entorno de desarrollo, ten esta lista a la mano y úsalos uno por uno.

En pocas semanas los tendrás automatizados y empezarás a combinarlos de formas que ni imaginabas. Ese es el momento en que Linux deja de ser intimidante y se convierte en tu herramienta más poderosa.

¿Quieres montar tu proyecto en un servidor Linux o necesitas ayuda con la infraestructura de tu sitio web? En DigiSpherix nos encargamos de todo — desde el código hasta el deploy. [Contáctanos](/#contacto) y platicamos.
