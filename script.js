// Client form submission
document.getElementById('client-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('client-name').value;
    const address = document.getElementById('client-address').value;
    const city = document.getElementById('client-city').value;
    const phone = document.getElementById('client-phone').value;
    const amount = parseFloat(document.getElementById('client-amount').value);
    // Store the request for admin notification
    const requests = JSON.parse(localStorage.getItem('clientRequests')) || [];
    requests.push({ name, address, city, phone, amount, id: Date.now() });
    localStorage.setItem('clientRequests', JSON.stringify(requests));
    // Show success notification to client
    const messageDiv = document.getElementById('client-message');
    messageDiv.innerHTML = '<p style="color: green;">Commande soumise avec succès ! Vous serez contacté bientôt pour les détails.</p>';
    messageDiv.classList.add('show');
    // Clear form
    document.getElementById('client-form').reset();
    // Update requests display for admin
    displayClientRequests();
});

// Debrousseur form submission
document.getElementById('debrousseur-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('deb-name').value;
    const email = document.getElementById('deb-email').value;
    const city = document.getElementById('deb-city').value;
    const phone = document.getElementById('deb-phone').value;
    // Store the debrousseur
    const debrousseurs = JSON.parse(localStorage.getItem('debrousseurs')) || [];
    debrousseurs.push({ name, email, city, phone, id: Date.now() });
    localStorage.setItem('debrousseurs', JSON.stringify(debrousseurs));
    // Simulate registration
    const messageDiv = document.getElementById('deb-message');
    messageDiv.innerHTML = `<p style="color: green;">Inscription réussie pour ${name}. Vous pouvez maintenant accepter les commandes des clients.</p>`;
    messageDiv.classList.add('show');
    // Clear form
    this.reset();
});

// Function to display client requests
function displayClientRequests() {
    const requests = JSON.parse(localStorage.getItem('clientRequests')) || [];
    const container = document.getElementById('client-requests');
    container.innerHTML = '<h3>Demandes Clients</h3>';
    if (requests.length === 0) {
        container.innerHTML += '<p>Aucune demande pour le moment.</p>';
        return;
    }
    requests.forEach(request => {
        const item = document.createElement('div');
        item.className = 'request-item';
        item.innerHTML = `
            <p><strong>Nom:</strong> ${request.name}</p>
            <p><strong>Adresse:</strong> ${request.address}, ${request.city}</p>
            <p><strong>Téléphone:</strong> ${request.phone}</p>
            <p><strong>Montant proposé:</strong> ${request.amount} €</p>
            <button onclick="acceptRequest(${request.id})">Accepter</button>
        `;
        container.appendChild(item);
    });
}

// Function to accept a request and simulate payment
function acceptRequest(id) {
    const requests = JSON.parse(localStorage.getItem('clientRequests')) || [];
    const request = requests.find(r => r.id === id);
    if (request) {
        const debName = prompt("Entrez votre nom de débrousseur:");
        if (debName) {
            const payment = (request.amount * 0.1).toFixed(2);
            alert(`Commande acceptée pour ${request.name}. Vous devez verser ${payment} € (10% du montant proposé).`);
            // Store in accepted requests
            const acceptedRequests = JSON.parse(localStorage.getItem('acceptedRequests')) || [];
            acceptedRequests.push({ ...request, debName, acceptedAt: new Date().toISOString() });
            localStorage.setItem('acceptedRequests', JSON.stringify(acceptedRequests));
            // Update debrousseur count
            const debrousseurs = JSON.parse(localStorage.getItem('debrousseurs')) || [];
            const deb = debrousseurs.find(d => d.name === debName);
            if (deb) {
                deb.acceptedCount = (deb.acceptedCount || 0) + 1;
                localStorage.setItem('debrousseurs', JSON.stringify(debrousseurs));
            }
            // Remove the request from storage
            const updatedRequests = requests.filter(r => r.id !== id);
            localStorage.setItem('clientRequests', JSON.stringify(updatedRequests));
            // Update display
            displayClientRequests();
        }
    }
}

// Function to display registered debrousseurs
function displayDebrousseurs() {
    const debrousseurs = JSON.parse(localStorage.getItem('debrousseurs')) || [];
    const container = document.getElementById('debrousseurs-list');
    container.innerHTML = '<h3>Liste des Débrousseurs</h3>';
    if (debrousseurs.length === 0) {
        container.innerHTML += '<p>Aucun débrousseur inscrit pour le moment.</p>';
        return;
    }
    debrousseurs.forEach(deb => {
        const item = document.createElement('div');
        item.className = 'debrousseur-item';
        item.innerHTML = `
            <p><strong>Nom:</strong> ${deb.name}</p>
            <p><strong>Email:</strong> ${deb.email}</p>
            <p><strong>Ville:</strong> ${deb.city}</p>
            <p><strong>Téléphone:</strong> ${deb.phone}</p>
        `;
        container.appendChild(item);
    });
}

// Function to display accepted requests
function displayAcceptedRequests() {
    const acceptedRequests = JSON.parse(localStorage.getItem('acceptedRequests')) || [];
    const container = document.getElementById('accepted-requests');
    container.innerHTML = '<h3>Commandes Acceptées</h3>';
    if (acceptedRequests.length === 0) {
        container.innerHTML += '<p>Aucune commande acceptée pour le moment.</p>';
        return;
    }
    acceptedRequests.forEach(request => {
        const item = document.createElement('div');
        item.className = 'accepted-item';
        item.innerHTML = `
            <p><strong>Client:</strong> ${request.name}</p>
            <p><strong>Adresse:</strong> ${request.address}, ${request.city}</p>
            <p><strong>Téléphone:</strong> ${request.phone}</p>
            <p><strong>Montant proposé:</strong> ${request.amount} €</p>
            <p><strong>Débrousseur:</strong> ${request.debName}</p>
            <p><strong>Accepté le:</strong> ${new Date(request.acceptedAt).toLocaleString()}</p>
        `;
        container.appendChild(item);
    });
}

// Function to check admin access
function checkAdmin() {
    const password = prompt("Entrez le mot de passe admin:");
    if (password === "admin") {
        document.getElementById('debrousseurs-list').style.display = 'block';
        document.getElementById('accepted-requests').style.display = 'block';
        displayDebrousseurs();
        displayAcceptedRequests();
    } else {
        alert("Accès refusé");
    }
}

// Load requests on page load
document.addEventListener('DOMContentLoaded', function() {
    displayClientRequests();
});
