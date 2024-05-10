document.addEventListener('DOMContentLoaded', function() {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,monero&vs_currencies=usd';

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const bitcoinPrice = data.bitcoin.usd;
        const ethereumPrice = data.ethereum.usd;
        const moneroPrice = data.monero.usd;
        
        document.getElementById('bitcoin-price').textContent = `Bitcoin: $${bitcoinPrice}`;
        document.getElementById('ethereum-price').textContent = `Ethereum: $${ethereumPrice}`;
        document.getElementById('kaspa-price').textContent = `Kaspa: $${kaspaPrice}`;
    })
    .catch(error => console.error('Error fetching data:', error));
});
