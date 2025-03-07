import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDidm4L55K8ykNswAduQpWW5RUgAr48sH8",
    authDomain: "compebe-7efe6.firebaseapp.com",
    databaseURL: "https://compebe-7efe6-default-rtdb.firebaseio.com",
    projectId: "compebe-7efe6",
    storageBucket: "compebe-7efe6.firebasestorage.app",
    messagingSenderId: "995708963765",
    appId: "1:995708963765:web:8701fa19936d57558ea7fc",
    measurementId: "G-JHW8WYLSRF"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Login
document.getElementById("btn-login").addEventListener("click", () => {
    const usuario = prompt("Usuario:");
    const contraseña = prompt("Contraseña:");

    if (usuario === "admin" && contraseña === "1234") {
        document.getElementById("admin-panel").classList.remove("d-none");
        alert("Sesión iniciada.");
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
});

// Agregar equipo
document.getElementById("form-equipo").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre-equipo").value;
    const categoria = document.getElementById("categoria-equipo").value;

    await db.collection(categoria).add({
        nombre,
        wod1: 0,
        wod2: 0,
        final: 0,
        total: 0
    });

    document.getElementById("form-equipo").reset();
    cargarTabla();
});

// Cargar tabla
async function cargarTabla() {
    const principiantes = await db.collection("principiantes").get();
    const avanzados = await db.collection("avanzados").get();

    mostrarTabla("tabla-principiantes", principiantes);
    mostrarTabla("tabla-avanzados", avanzados);
}

function mostrarTabla(idTabla, snapshot) {
    const tbody = document.getElementById(idTabla);
    tbody.innerHTML = "";

    const equipos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    equipos.sort((a, b) => b.total - a.total);

    equipos.forEach((equipo, index) => {
        const fila = `
            <tr>
                <td>${index + 1}</td>
                <td>${equipo.nombre}</td>
                <td contenteditable="true" data-id="${equipo.id}" data-field="wod1">${equipo.wod1}</td>
                <td contenteditable="true" data-id="${equipo.id}" data-field="wod2">${equipo.wod2}</td>
                <td contenteditable="true" data-id="${equipo.id}" data-field="final">${equipo.final}</td>
                <td>${equipo.total}</td>
                <td><button class="btn btn-success btn-sm guardar" data-id="${equipo.id}">Guardar</button></td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });

    document.querySelectorAll(".guardar").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = e.target.dataset.id;
            const fila = e.target.closest("tr");
            const wod1 = parseInt(fila.children[2].innerText);
            const wod2 = parseInt(fila.children[3].innerText);
            const final = parseInt(fila.children[4].innerText);
            const total = wod1 + wod2 + final;

            await db.collection(idTabla.includes("principiantes") ? "principiantes" : "avanzados").doc(id).update({ wod1, wod2, final, total });
            cargarTabla();
        });
    });
}

// Cargar datos al iniciar
cargarTabla();
