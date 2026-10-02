const modalitiesCollection = db.collection("modalities");

const modalitiesList = document.getElementById("modalities-list");
const modalitiesSearch = document.getElementById("modalities-search");

let modalities = [];
let categories = {};

function renderModalities(data) {

    modalitiesList.innerHTML = "";

    if (data.length === 0) {

        modalitiesList.innerHTML = `
            <p class="list-message">
                Nenhuma modalidade encontrada.
            </p>
        `;

        return;
    }

    const categoryArticles = {};

    data.forEach(modality => {

        const category =
            modality.category || "Sem categoria";

        if (categoryArticles[category]) {
            return;
        }

        const article =
            document.createElement("article");

        article.className =
            "modalities-category";

        article.dataset.category =
            category;

        const header =
            document.createElement("h3");

        header.textContent =
            `${category}`;

        article.appendChild(header);

        modalitiesList.appendChild(article);

        categoryArticles[category] =
            article;

    });

    data.forEach(modality => {

        const category =
            modality.category || "Sem categoria";

        const article =
            categoryArticles[category];

        const item =
            document.createElement("div");

        item.className =
            "list-item";

        const name =
            document.createElement("span");

        name.className =
            "list-item-main-value";

        name.textContent =
            `${modality.description} | ` +
            `${modality.value} €`;

        const actions =
            document.createElement("div");

        actions.className =
            "list-item-actions";

        actions.innerHTML = `
            <button
                class="list-item-action"
                data-action="view"
                data-id="${modality.documentId}"
                aria-label="Consultar">

                <img
                    src="https://personalcross.github.io/assets/store/eye.png"
                    alt="">

            </button>

            <button
                class="list-item-action"
                data-action="edit"
                data-id="${modality.documentId}"
                aria-label="Editar">

                <img
                    src="https://personalcross.github.io/assets/store/pencil.png"
                    alt="">

            </button>

            <button
                class="list-item-action"
                data-action="delete"
                data-id="${modality.documentId}"
                aria-label="Eliminar">

                <img
                    src="https://personalcross.github.io/assets/store/trash.png"
                    alt="">

            </button>
        `;

        item.appendChild(name);
        item.appendChild(actions);

        article.appendChild(item);

    });
}

async function loadModalities() {

    modalitiesList.innerHTML = `
        <p class="list-message">A carregar modalidades...</p>
    `;

    try {

        const snapshot = await modalitiesCollection.get();

        modalities = snapshot.docs.map(doc => ({
            documentId: doc.id,
            ...doc.data()
        }));

        modalities.sort((a, b) => {

            // group by category
            if (a.category !== b.category) {
                
                // add categories to categories dict
                if (Object.hasOwn(categories, a.category)) {
                    categories[a.category] += 1;
                } else {
                    categories[a.category] = 1;
                }

                if (Object.hasOwn(categories, b.category)) {
                    categories[b.category] += 1;
                } else {
                    categories[b.category] = 1;
                }

                return (a.category || "").localeCompare(
                    b.category || "",
                    "pt-BR",
                    {
                        sensitivity: "base"
                    }
                );
            }

            // alfa order inside groups
            return (a.description || "").localeCompare(
                b.description || "",
                "pt-BR",
                {
                    sensitivity: "base"
                }
            );

        });

        renderModalities(modalities);

    } catch(error) {
        modalitiesList.innerHTML = `
            <p class="list-message">
                Não foi possível carregar as modalidades.
                ${error}
            </p>
        `;
    }
}

modalitiesSearch.addEventListener("input", event => {
    const search = event.target.value
        .trim()
        .toLocaleLowerCase("pt-PT");

    if (!search) {
        renderModalities(modalities);
        return;
    }

    const filtered = modalities.filter(modality =>
        (modality.category + modality.description || "")
            .toLocaleLowerCase("pt-PT")
            .includes(search)
    );

    renderModalities(filtered);
});

async function deleteModality(modality) {
    if (!modality || !modality.documentId) {
        return;
    }

    const modalityName = modality.category + " " + modality.description || "esta modalidade";

    const confirmed = window.confirm(
        `Tem certeza de que deseja eliminar "${modalityName}"?\n\n` +
        "Esta ação não pode ser desfeita."
    );

    if (!confirmed) {
        return;
    }

    try {
        await db.collection("modalities")
            .doc(modality.documentId)
            .delete();

        M.toast({
            html: "Modalidade eliminada com sucesso."
        });

        await loadModalities();
    
    } catch (error) {
        M.toast({
            html: "Não foi possível eliminar o exercício."
        });
    }
}

modalitiesList.addEventListener("click", async event => {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const action = button.dataset.action;
    const documentId = button.dataset.id;

    const modality = modalities.find(
        item => item.documentId === documentId
    );

    if (!modality) return;

    if (action === "view") {
        openModalityById(documentId,"view");
        return;
    }

    if (action === "edit") {
        openModalityById(documentId, "edit");
        return;
    }

    if (action === "delete") {
        await deleteModality(modality);
    }
});

loadModalities();
