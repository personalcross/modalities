const categoryOptions = [
    "Acima de 90 anos de idade",
    "Até 64 anos de idade",
    "Até 89 anos de idade",
    "De 65 à 89 anos de idade",
    "Mente e Corpo"
];

const modalityModal = document.getElementById("modality-modal");
const modalityModalTitle = document.getElementById("modality-modal-title");
const modalityForm = document.getElementById("modality-form");

const modalityDocumentId = document.getElementById("modality-document-id");
const modalityCategory = document.getElementById("modality-category");
const modalityDescription = document.getElementById("modality-description");
const modalityValue = document.getElementById("modality-value");

const btnAddModality = document.getElementById("btn-add-modality");
const btnCancelModality = document.getElementById("btn-cancel-modality");
const btnSaveModality = document.getElementById("btn-save-modality");
const btnCloseModality = document.getElementById("btn-close-modality");

let modalityModalMode = "add";

function refreshMaterializeSelects() {
    const selects = document.querySelectorAll(
        "#modality-modal select"
    );

    selects.forEach(select => {
        const instance = M.FormSelect.getInstance(select);

        if (instance) {
            instance.destroy();
        }

        M.FormSelect.init(select);
    });
}

function setModalityModalMode(mode) {
    modalityModalMode = mode;

    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isAdd = mode = "add";
    
    modalityModalTitle.textContent =
        isAdd ? "Adicionar modalidade" 
            : isEdit ? "Editar modalidade"
                : "Visualizar modalidade";

    modalityCategory.disabled = isView;
    modalityDescription.disabled = isView;
    modalityValue.disabled = isView;

    btnSaveModality.style.display = isView ? "none" : "";
    btnCancelModality.style.display = isView ? "none" : "";
    btnCloseModality.style.display = isView ? "" : "none";

    refreshMaterializeSelects();
}

function resetModalityForm() {
    modalityForm.reset();
    modalityDocumentId.value = "";

    refreshMaterializeSelects();
    M.updateTextFields();

    modalityCategory.value = "";
    modalityDescription.value = "";
    modalityValue.value = null;
}

function fillModalityForm(modality) {
    modalityDocumentId.value = modality.documentId || "";

    modalityCategory.value = categoryOptions.indexOf(modality.category).toString() || "";
    modalityDescription.value = modality.description || "";
    modalityValue.value = modality.value || 0;

    refreshMaterializeSelects();
    M.updateTextFields();
}

function openModalityModal(mode = "add", modality = null)
{
    resetModalityForm();
    setModalityModalMode(mode);
    if (modality) {
        fillModalityForm(modality);
    }

    const instance = M.Modal.getInstance(modalityModal);

    if (instance) {
        instance.open();
    }
}

function closeModalityModal() {
    const instance = M.Modal.getInstance(modalityModal);

    if (instance) {
        instance.close();
    }
}

function getModalityFormData() {
    return {
        category: categoryOptions[modalityCategory.value],
        description: modalityDescription.value,
        value: modalityValue.value
    };
}

function validateModality(data) {
    if (!data.category) {
        M.toast({
            html: "Informe a categoria."
        });

        modalityCategory.focus();
        return false;
    }

    if (!data.description) {
        M.toast({
            html: "Informe a descrição."
        });

        modalityDescription.focus();
        return false;
    }

    if (!data.value) {
        M.toast({
            html: "Informe o valor."
        });

        modalityValue.focus();
        return false;
    }

    return true;
}

async function saveModality() {
    const data = getModalityFormData();

    if (!validateModality(data)) {
        return;
    }

    btnSaveModality.disabled = true;

    try {
        if (modalityModalMode === "add") {
            await db.collection("modalities").add({
                ...data,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            M.toast({
                html: "Modalidade adicionada com sucesso."
            });
        } else if (modalityModalMode === "edit") {
            const documentId = modalityDocumentId.value;

            if (!documentId) {
                throw new Error(
                    "Não foi possível identificar a modalidade."
                );
            }

            await db.collection("modalities")
                .doc(documentId)
                .update({
                    ...data,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(0)
                });

            M.toast({
                html: "Modalidade atualizada com sucesso."
            });
        }

        closeModalityModal();

        if (typeof loadModalities === "function") {
            await loadModalities();
        }
    } catch(error) {

        M.toast({
            html: "Não foi possível salvar o exercício."
        });

    } finally {
        
        btnSaveModality.disabled = false;
    
    }
}

async function openModalityById(documentId, mode) {
    if (!documentId) {
        return;
    }

    try {
        const document = await db.collection("modalities")
            .doc(documentId)
            .get();

        if (!document.exists) {
            M.toast({
                html: "Modalidade não encontrada."
            });

            return;
        }

        const modality = {
            documentId: document.id,
            ...document.data()
        };

        openModalityModal(mode, modality);

    } catch (error) {

        M.toast({
            html: "Não foi possível carregar a modalidade."
        });

    }
}

btnAddModality.addEventListener("click", () => {
    openModalityModal("add");
});

btnCancelModality.addEventListener("click", () => {
    closeModalityModal();
});

btnCloseModality.addEventListener("click", () => {
    closeModalityModal();
});

modalityForm.addEventListener("submit", event => {
    event.preventDefault();

    if (modalityModalMode === "view") {
        return;
    }

    saveModality();
});

document.addEventListener("DOMContentLoaded", () => {
    M.Modal.init(modalityModal, {
        dismissible: true,
        onCloseEnd: () => {
            resetModalityForm();
        }
    });

    refreshMaterializeSelects();
});
