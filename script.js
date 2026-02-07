// Client form submission
document.getElementById('client-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('client-name').value;
    const address = document.getElementById('client-address').value;
    const city = document.getElementById('client-city').value;
    const phone = document.getElementById('client-phone').value;
    const paymentMethod = document.getElementById('client-payment-method').value;
    // Airtel Money API payment for 500F
    const airtelBaseUrl = "https://openapiuat.airtel.ga"; // UAT URL, change to https://openapi.airtel.ga for production
    const clientId = "YOUR_AIRTEL_CLIENT_ID"; // Replace with your Airtel Client ID
    const clientSecret = "YOUR_AIRTEL_CLIENT_SECRET"; // Replace with your Airtel Client Secret
    const recipientPhone = "074884794"; // Your Airtel Money account

    // Step 1: Get access token
    fetch(`${airtelBaseUrl}/auth/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    })
    .then(response => response.json())
    .then(data => {
        const accessToken = data.access_token;
        // Step 2: Initiate payment
        return fetch(`${airtelBaseUrl}/merchant/v1/payments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
                'X-Country': 'CI', // Côte d'Ivoire
                'X-Currency': 'XAF'
            },
            body: JSON.stringify({
                "reference": "STR-500-" + Date.now(),
                "subscriber": {
                    "country": "CI",
                    "currency": "XAF",
                    "msisdn": phone
                },
                "transaction": {
                    "amount": 500,
                    "country": "CI",
                    "currency": "XAF",
                    "id": "STR-500-" + Date.now()
                }
            })
        });
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'SUCCESS') {
            // Store the request for admin notification
            const requests = JSON.parse(localStorage.getItem('clientRequests')) || [];
            requests.push({ name, address, city, phone, paymentMethod, id: Date.now() });
            localStorage.setItem('clientRequests', JSON.stringify(requests));
            // Show success notification to client
            const messageDiv = document.getElementById('client-message');
            messageDiv.innerHTML = '<p style="color: green;">Paiement réussi ! Commande validée. Vous serez contacté bientôt pour les détails.</p>';
            messageDiv.classList.add('show');
            // Clear form
            document.getElementById('client-form').reset();
            // Update requests display for admin
            displayClientRequests();
        } else {
            alert('Paiement échoué. Veuillez réessayer.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Erreur de paiement. Veuillez réessayer.');
    });
});

// Debrousseur form submission
document.getElementById('debrousseur-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('deb-name').value;
    const email = document.getElementById('deb-email').value;
    const phone = document.getElementById('deb-phone').value;
    const paymentMethod = document.getElementById('deb-payment-method').value;
    // Store the debrousseur
    const debrousseurs = JSON.parse(localStorage.getItem('debrousseurs')) || [];
    debrousseurs.push({ name, email, city, phone, paymentMethod, id: Date.now() });
    localStorage.setItem('debrousseurs', JSON.stringify(debrousseurs));
    // Simulate registration
    const messageDiv = document.getElementById('deb-message');
    messageDiv.innerHTML = `<p style="color: green;">Inscription réussie pour ${name}. Vous paierez 10% (50F) sur chaque commande acceptée.</p>`;
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
            <button onclick="acceptRequest(${request.id})">Accepter et payer 10% (50F)</button>
        `;
        container.appendChild(item);
    });
}

// Function to accept a request and simulate payment
function acceptRequest(id) {
    const requests = JSON.parse(localStorage.getItem('clientRequests')) || [];
    const request = requests.find(r => r.id === id);
    if (request) {
        // Airtel Money API payment for 10%
        const airtelBaseUrl = "https://openapiuat.airtel.ga"; // UAT URL, change to https://openapi.airtel.ga for production
        const clientId = "YOUR_AIRTEL_CLIENT_ID"; // Replace with your Airtel Client ID
        const clientSecret = "YOUR_AIRTEL_CLIENT_SECRET"; // Replace with your Airtel Client Secret
        const recipientPhone = "074884794"; // Your Airtel Money account

        // Step 1: Get access token
        fetch(`${airtelBaseUrl}/auth/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        })
        .then(response => response.json())
        .then(data => {
            const accessToken = data.access_token;
            // Step 2: Initiate payment
            return fetch(`${airtelBaseUrl}/merchant/v1/payments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                    'X-Country': 'CI', // Côte d'Ivoire
                    'X-Currency': 'XAF'
                },
                body: JSON.stringify({
                    "reference": "STR-10-" + Date.now(),
                    "subscriber": {
                        "country": "CI",
                        "currency": "XAF",
                        "msisdn": request.phone
                    },
                    "transaction": {
                        "amount": 50,
                        "country": "CI",
                        "currency": "XAF",
                        "id": "STR-10-" + Date.now()
                    }
                })
            });
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                alert(`Paiement des 10% (50F) réussi via ${request.paymentMethod} pour la commande de ${request.name}.`);
                // Remove the request from storage
                const updatedRequests = requests.filter(r => r.id !== id);
                localStorage.setItem('clientRequests', JSON.stringify(updatedRequests));
                // Update display
                displayClientRequests();
            } else {
                alert('Paiement échoué. Veuillez réessayer.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Erreur de paiement. Veuillez réessayer.');
        });
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
            <p><strong>Moyen de paiement:</strong> ${deb.paymentMethod}</p>
        `;
        container.appendChild(item);
    });
}

// Function to check admin access
function checkAdmin() {
    const password = prompt("Entrez le mot de passe admin:");
    if (password === "admin") {
        document.getElementById('debrousseurs-list').style.display = 'block';
        displayDebrousseurs();
    } else {
        alert("Accès refusé");
    }
}

// Load requests on page load
document.addEventListener('DOMContentLoaded', function() {
    displayClientRequests();
});
