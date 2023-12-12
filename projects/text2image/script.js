const apiKey = "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";
const maxImages = 4;
let selectedImageNumber = null;

// Separate query function
async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
        {
            headers: { Authorization: `Bearer ${apiKey}` },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    if (!response.ok) {
        throw new Error('Failed to fetch image');
    }
    return await response.blob();
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function disableGenerateButton() {
    document.getElementById("generate").disabled = true;
}

function enableGenerateButton() {
    document.getElementById("generate").disabled = false;
}

function clearImageGrid() {
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}

async function generateImages(input) {
    disableGenerateButton();
    clearImageGrid();
    const loading = document.getElementById("loading");
    loading.style.display = "block";

    for (let i = 0; i < maxImages; i++) {
        try {
            const randomNumber = getRandomNumber(1, 10000);
            const prompt = `${input} ${randomNumber}`;
            const blob = await query({ "inputs": prompt });
            const imgUrl = URL.createObjectURL(blob);

            const img = document.createElement("img");
            img.src = imgUrl;
            img.alt = `art-${i + 1}`;
            img.onclick = () => downloadImage(imgUrl, i);
            document.getElementById("image-grid").appendChild(img);
        } catch (error) {
            alert(error.message);
        }
    }

    loading.style.display = "none";
    enableGenerateButton();
    selectedImageNumber = null;
}

document.getElementById("generate").addEventListener('click', () => {
    const input = document.getElementById("user-prompt").value;
    generateImages(input);
});

function downloadImage(imgUrl, imageNumber) {
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}
