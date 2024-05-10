document.addEventListener('DOMContentLoaded', function() {
  
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd')
    .then(response => response.json())
    .then(data => {
      
        const pricesDiv = document.getElementById('prices');
        pricesDiv.innerHTML = `
            <p>Bitcoin: $${data.bitcoin.usd}</p>
            <p>Ethereum: $${data.ethereum.usd}</p>
            <p>Solana: $${data.solana.usd}</p>
        `;
      
    })
    .catch(error => console.error('Error fetching data: ', error));
  
});
