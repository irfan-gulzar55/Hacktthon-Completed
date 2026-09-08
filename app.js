const research = [];

const contactSection = document.querySelector('#contact-us');
const contactFooter = document.querySelector('footer#contact');
if (contactSection) contactSection.id = 'contact';
if (contactFooter) contactFooter.id = 'contact-footer';
document.querySelector('.stats-section')?.remove();
document.querySelector('.featured-section')?.remove();

const grid = document.querySelector('#research-grid');
const searchInput = document.querySelector('#search-input');
const count = document.querySelector('#result-count');
const empty = document.querySelector('#empty-state');
let activeFilter = 'All';
const categoryDescriptions = {
  'Medicinal Plants': 'Medicinal plants have been part of traditional healthcare practices for generations. Our research explores their scientific identities, traditional uses, important compounds, and available scientific evidence. By connecting local knowledge with modern research, we aim to understand which plants deserve deeper scientific investigation while respecting biodiversity and traditional knowledge.',
  'Natural Compounds': 'Plants and other natural sources contain diverse compounds that scientists study for their biological properties. Our research section explores these natural compounds, their sources, reported activities, and the evidence surrounding them. Understanding these compounds may help researchers identify new questions and potential directions for future drug discovery.',
  'Cancer Research': 'Natural products have attracted scientific interest as a source of compounds for cancer research. Our platform highlights research investigating plant-derived compounds and other natural substances in areas such as cancer biology and laboratory studies. We focus on evidence and research progress rather than presenting natural products as proven cancer treatments.',
  'Antimicrobial Research': 'Antimicrobial research investigates substances that may affect microorganisms such as bacteria and fungi. Our research explores natural compounds and plant extracts that have been investigated for antimicrobial activity, while distinguishing laboratory findings from proven medical applications. This area may provide valuable research questions for understanding natural sources of antimicrobial compounds.',
  'Traditional Medicine': 'Traditional medicine represents generations of knowledge about plants, natural resources, and health practices developed by communities around the world. We document this knowledge with respect and explore how modern scientific methods can investigate traditional observations. Our aim is to preserve valuable knowledge while encouraging responsible, evidence-based research.'
};
const categoryOverview = document.createElement('div');
categoryOverview.className = 'information-panel category-overview';
categoryOverview.hidden = true;
document.querySelector('#research .research-grid').before(categoryOverview);

function renderCards() {
  const query = searchInput.value.trim().toLowerCase();
  const matches = research.filter((item) => {
    const matchesFilter = activeFilter === 'All' || item.category === activeFilter;
    const searchable = `${item.title} ${item.plant} ${item.category} ${item.description}`.toLowerCase();
    return matchesFilter && searchable.includes(query);
  });
  grid.innerHTML = matches.map((item) => `
    <article class="research-card">
      <div class="card-top"><span class="badge">${item.category}</span><span class="evidence">${item.evidence}</span></div>
      <h3>${item.title}</h3><p class="plant-name">${item.plant}</p><p>${item.description}</p>
      <div class="card-bottom"><span class="author">${item.author} · ${item.date}</span><button class="read-more" type="button" data-title="${item.title}">Read more ↗</button></div>
    </article>`).join('');
  count.textContent = `Showing ${matches.length} of 500+ discoveries`;
  empty.hidden = research.length === 0 || matches.length !== 0;
  document.querySelector('.browse-row').hidden = true;
  const descriptionsToShow = activeFilter === 'All'
    ? Object.entries(categoryDescriptions)
    : categoryDescriptions[activeFilter] ? [[activeFilter, categoryDescriptions[activeFilter]]] : [];
  categoryOverview.hidden = descriptionsToShow.length === 0;
  categoryOverview.innerHTML = descriptionsToShow
    .map(([category, description]) => `<div class="category-description"><h3>${category}</h3><p>${description}</p></div>`)
    .join('');
}

document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('.filter.active').classList.remove('active');
  button.classList.add('active');
  activeFilter = button.dataset.filter;
  renderCards();
}));
searchInput.addEventListener('input', renderCards);
document.querySelector('#clear-filters').addEventListener('click', () => {
  activeFilter = 'All'; searchInput.value = '';
  document.querySelector('.filter.active').classList.remove('active');
  document.querySelector('[data-filter="All"]').classList.add('active');
  renderCards();
});
grid.addEventListener('click', (event) => {
  const button = event.target.closest('.read-more');
  if (button) window.alert(`${button.dataset.title}\n\nFull evidence record coming soon.`);
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

function setMobileMenuState(open) {
  if (!mobileMenu || !menuToggle) return;
  mobileMenu.classList.toggle('open', open);
  if (open) {
    mobileMenu.removeAttribute('hidden');
    mobileMenu.hidden = false;
  } else {
    mobileMenu.setAttribute('hidden', '');
    mobileMenu.hidden = true;
  }
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  mobileMenu.setAttribute('aria-hidden', String(!open));
}

if (menuToggle && mobileMenu) {
  setMobileMenuState(false);

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = !mobileMenu.classList.contains('open');
    setMobileMenuState(willOpen);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setMobileMenuState(false);
    });
  });

  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') && !e.target.closest('.site-header')) {
      setMobileMenuState(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      setMobileMenuState(false);
    }
  });
}
renderCards();

const submissionModal = document.querySelector('#submission-modal');
const detailModal = document.querySelector('#detail-modal');
const submissionForm = document.querySelector('#submission-form');
const successState = document.querySelector('.success-state');
const dropzone = document.querySelector('#dropzone');

function openModal(modal) {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('open');
  if (!document.querySelector('.modal.open')) document.body.style.overflow = '';
}

document.querySelectorAll('[data-open-submit]').forEach((button) => button.addEventListener('click', () => openModal(submissionModal)));
document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => {
  closeModal(button.closest('.modal'));
  if (button.closest('#submission-modal')) {
    submissionForm.hidden = false;
    successState.hidden = true;
  }
}));
document.querySelectorAll('.modal').forEach((modal) => modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal(modal);
}));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') document.querySelectorAll('.modal.open').forEach(closeModal);
});

submissionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  submissionForm.hidden = true;
  successState.hidden = false;
});

document.querySelector('#file-upload').addEventListener('change', (event) => {
  if (event.target.files.length) dropzone.querySelector('strong').textContent = `${event.target.files.length} file${event.target.files.length > 1 ? 's' : ''} selected`;
});
['dragenter', 'dragover'].forEach((eventName) => dropzone.addEventListener(eventName, (event) => {
  event.preventDefault();
  dropzone.classList.add('drag-over');
}));
['dragleave', 'drop'].forEach((eventName) => dropzone.addEventListener(eventName, (event) => {
  event.preventDefault();
  dropzone.classList.remove('drag-over');
}));
dropzone.addEventListener('drop', (event) => {
  const files = event.dataTransfer.files;
  if (files.length) dropzone.querySelector('strong').textContent = `${files.length} file${files.length > 1 ? 's' : ''} selected`;
});

function openDetail(title) {
  document.querySelector('#detail-title').textContent = title === 'Golden thread' ? 'Curcumin and the language of inflammation' : title === 'Periwinkle pathways' ? 'Plant chemistry meets oncology: the periwinkle story' : 'Reishi and the immune conversation';
  openModal(detailModal);
}

grid.addEventListener('click', (event) => {
  const button = event.target.closest('.read-more');
  if (button) openDetail(button.dataset.title);
});
document.querySelectorAll('.discovery-trigger').forEach((button) => button.addEventListener('click', () => openDetail(button.dataset.title)));
document.querySelector('[data-save]').addEventListener('click', (event) => {
  event.currentTarget.textContent = 'Saved research ✓';
});
document.querySelector('[data-share]').addEventListener('click', async () => {
  if (navigator.share) await navigator.share({ title: document.title, url: window.location.href });
  else window.alert('Research link copied for sharing.');
});
document.querySelector('[data-download]').addEventListener('click', () => window.alert('PDF export will be available when research records connect to the archive.'));

const lightboxModal = document.querySelector('#lightbox-modal');
const livingArchiveCard = document.querySelector('.gallery-card[data-gallery-title="A living archive of medicinal leaves"]');
if (livingArchiveCard) livingArchiveCard.remove();
const quietLabCard = document.querySelector('.gallery-card[data-gallery-title="A quiet moment in the lab"]');
if (quietLabCard) quietLabCard.remove();
const curcuminProfileCard = document.querySelector('.gallery-card[data-gallery-title="Curcumin compound profile"]');
if (curcuminProfileCard) curcuminProfileCard.remove();
const forestCanopyCard = document.querySelector('.gallery-card[data-gallery-title="Patterns in a forest canopy"]');
if (forestCanopyCard) forestCanopyCard.remove();
const peopleBehindQuestionsCard = document.querySelector('.gallery-card[data-gallery-title="The people behind the questions"]');
if (peopleBehindQuestionsCard) peopleBehindQuestionsCard.remove();
const uploadedPoppyImage = document.querySelector('img[src="images/opium-poppy.jpg"]');
if (uploadedPoppyImage) uploadedPoppyImage.src = 'images/(Papaver somniferum), ,.jpg';
const laboratorySpecimenCard = document.createElement('button');
laboratorySpecimenCard.className = 'gallery-card gallery-photo-card';
laboratorySpecimenCard.type = 'button';
laboratorySpecimenCard.dataset.galleryCategory = 'Laboratory Research';
laboratorySpecimenCard.dataset.galleryTitle = 'Laboratory Herbal Specimen Display';
laboratorySpecimenCard.dataset.galleryCaption = 'Laboratory Research · Medicinal natural products';
laboratorySpecimenCard.dataset.galleryDescription = 'This photograph shows a laboratory specimen display of medicinal natural products, including Reishi mushroom, Willow (Salix alba) bark and leaves, and Ashwagandha (Withania somnifera) root. These specimens are preserved for botanical identification, phytochemical research, and study of their traditional medicinal properties. Willow bark contains salicin, a compound related to the development of aspirin and studied for pain and inflammation. Ashwagandha is an important Ayurvedic medicinal plant containing withanolides, which are being investigated for effects related to stress, sleep, and inflammation. Source context: nccih.nih.gov.';
laboratorySpecimenCard.innerHTML = '<img class="gallery-photo" src="images/labotery rescarch.jpg" alt="Laboratory display of Reishi, Willow, and Ashwagandha specimens"><span class="gallery-caption"><strong>Herbal specimen display</strong><span class="gallery-title">Reishi · Willow · Ashwagandha</span><span class="gallery-description">Botanical identification · Phytochemical research</span></span>';
document.querySelector('.gallery-grid').appendChild(laboratorySpecimenCard);
const preservedPlantsCard = document.createElement('button');
preservedPlantsCard.className = 'gallery-card gallery-photo-card';
preservedPlantsCard.type = 'button';
preservedPlantsCard.dataset.galleryCategory = 'Laboratory Research';
preservedPlantsCard.dataset.galleryTitle = 'Preserved Plants for Laboratory Research';
preservedPlantsCard.dataset.galleryCaption = 'Laboratory Research · Preserved plant specimens';
preservedPlantsCard.dataset.galleryDescription = 'Preserved plant specimens prepared for laboratory observation, botanical identification, and natural product research.';
preservedPlantsCard.innerHTML = '<img class="gallery-photo" src="images/labotery pserve plants.png" alt="Preserved plants prepared for laboratory research"><span class="gallery-caption"><strong>Preserved plant specimens</strong><span class="gallery-title">Laboratory research</span><span class="gallery-description">Botanical identification · Natural product research</span></span>';
document.querySelector('.gallery-grid').appendChild(preservedPlantsCard);
const preservedPlantsArchiveCard = document.createElement('button');
preservedPlantsArchiveCard.className = 'gallery-card gallery-photo-card';
preservedPlantsArchiveCard.type = 'button';
preservedPlantsArchiveCard.dataset.galleryCategory = 'Laboratory Research';
preservedPlantsArchiveCard.dataset.galleryTitle = 'Preserved Plants Archive';
preservedPlantsArchiveCard.dataset.galleryCaption = 'Laboratory Research · Preserved plants';
preservedPlantsArchiveCard.dataset.galleryDescription = 'Preserved plants documented for laboratory research, botanical study, and natural product investigation.';
preservedPlantsArchiveCard.innerHTML = '<img class="gallery-photo" src="images/preserve plants.png" alt="Preserved plants documented for laboratory research"><span class="gallery-caption"><strong>Preserved plants archive</strong><span class="gallery-title">Laboratory research</span><span class="gallery-description">Botanical study · Natural product investigation</span></span>';
document.querySelector('.gallery-grid').appendChild(preservedPlantsArchiveCard);
const flyAgaricCard = document.createElement('button');
flyAgaricCard.className = 'gallery-card gallery-photo-card';
flyAgaricCard.type = 'button';
flyAgaricCard.dataset.galleryCategory = 'Nature';
flyAgaricCard.dataset.galleryTitle = 'Fly Agaric (Amanita muscaria)';
flyAgaricCard.dataset.galleryCaption = 'Nature · Amanita muscaria';
flyAgaricCard.dataset.galleryDescription = 'Fly Agaric (Amanita muscaria) is a distinctive mushroom traditionally associated with various cultural and ethnobotanical practices. It contains biologically active compounds such as muscimol and ibotenic acid and is not considered safe for self-medication because it can be toxic.';
flyAgaricCard.innerHTML = '<img class="gallery-photo" src="images/Fly Agaric.jpg" alt="Fly Agaric, Amanita muscaria"><span class="gallery-caption"><strong>Fly Agaric</strong><span class="gallery-title">Amanita muscaria</span><span class="gallery-description">Muscimol and ibotenic acid · Not safe for self-medication</span></span>';
document.querySelector('.gallery-grid').appendChild(flyAgaricCard);
const amanitaCompoundCard = document.createElement('button');
amanitaCompoundCard.className = 'gallery-card gallery-photo-card';
amanitaCompoundCard.type = 'button';
amanitaCompoundCard.dataset.galleryCategory = 'Natural Compounds';
amanitaCompoundCard.dataset.galleryTitle = 'Fly Agaric (Amanita muscaria (L.) Lam.)';
amanitaCompoundCard.dataset.galleryCaption = 'Natural Compounds · Amanita muscaria';
amanitaCompoundCard.dataset.galleryDescription = 'Local name: Fly Agaric / Toadstool. Scientific name: Amanita muscaria (L.) Lam. This mushroom is important in mycological and ecological research, especially for studying fungi and their relationships with forest trees. It contains bioactive compounds such as muscimol and ibotenic acid and has a long history of ethnomycological use. Note: It is a poisonous mushroom and should not be consumed; ingestion can cause serious neurological and gastrointestinal effects.';
amanitaCompoundCard.innerHTML = '<img class="gallery-photo" src="images/Amanita muscaria (L.) Lam.jpg" alt="Fly Agaric mushroom, Amanita muscaria"><span class="gallery-caption"><strong>Fly Agaric</strong><span class="gallery-title">Amanita muscaria (L.) Lam. · Toadstool</span><span class="gallery-description">Muscimol and ibotenic acid · Poisonous mushroom</span></span>';
document.querySelector('.gallery-grid').appendChild(amanitaCompoundCard);
const cistancheCard = document.createElement('button');
cistancheCard.className = 'gallery-card gallery-photo-card';
cistancheCard.type = 'button';
cistancheCard.dataset.galleryCategory = 'Medicinal Plants';
cistancheCard.dataset.galleryTitle = 'Cistanche (Cistanche spp.)';
cistancheCard.dataset.galleryCaption = 'Medicinal Plants · Cistanche spp.';
cistancheCard.dataset.galleryDescription = 'Cistanche (Cistanche spp.) is a parasitic medicinal plant found in dry and semi-arid regions, recognized by its thick stem and scale-like leaves. It has a long history in traditional medicine and is being studied for antioxidant, anti-inflammatory, digestive, and other potential biological properties. Traditional uses vary by species and region, so identification should be confirmed before making medicinal claims.';
cistancheCard.innerHTML = '<img class="gallery-photo" src="images/Cistanche spp.jpg" alt="Cistanche, Cistanche species"><span class="gallery-caption"><strong>Cistanche</strong><span class="gallery-title">Cistanche spp.</span><span class="gallery-description">Parasitic medicinal plant · Traditional uses and ongoing research</span></span>';
document.querySelector('.gallery-grid').appendChild(cistancheCard);
const bergeniaCard = document.createElement('button');
bergeniaCard.className = 'gallery-card gallery-photo-card';
bergeniaCard.type = 'button';
bergeniaCard.dataset.galleryCategory = 'Medicinal Plants';
bergeniaCard.dataset.galleryTitle = 'Hairy Bergenia (Bergenia ciliata)';
bergeniaCard.dataset.galleryCaption = 'Medicinal Plants · Bergenia ciliata';
bergeniaCard.dataset.galleryDescription = 'Hairy Bergenia (Bergenia ciliata) is a Himalayan medicinal herb traditionally used in South Asian herbal medicine, particularly for urinary and kidney-related problems, including kidney stones. Its rhizomes contain bioactive compounds such as bergenin, gallic acid, and catechins, which are being studied for antioxidant and anti-inflammatory properties. Note: These are traditional and research findings, not a recommendation to use the plant as a treatment.';
bergeniaCard.innerHTML = '<img class="gallery-photo" src="images/Bergenia ciliata.jpg" alt="Hairy Bergenia, Bergenia ciliata"><span class="gallery-caption"><strong>Hairy Bergenia</strong><span class="gallery-title">Bergenia ciliata</span><span class="gallery-description">Himalayan herb · Traditional uses and ongoing research</span></span>';
document.querySelector('.gallery-grid').appendChild(bergeniaCard);
const seaBuckthornCard = document.createElement('button');
seaBuckthornCard.className = 'gallery-card gallery-photo-card';
seaBuckthornCard.type = 'button';
seaBuckthornCard.dataset.galleryCategory = 'Medicinal Plants';
seaBuckthornCard.dataset.galleryTitle = 'Sea Buckthorn (Hippophae rhamnoides)';
seaBuckthornCard.dataset.galleryCaption = 'Medicinal Plants · Hippophae rhamnoides';
seaBuckthornCard.dataset.galleryDescription = 'Sea Buckthorn (Hippophae rhamnoides) is a thorny medicinal plant found in mountainous regions, recognized by its narrow silvery-green leaves and bright orange berries. Its fruits are rich in vitamin C and antioxidant compounds and have traditional nutritional and medicinal uses. It is being studied for its potential antioxidant and anti-inflammatory properties.';
seaBuckthornCard.innerHTML = '<img class="gallery-photo" src="images/Hippophae rhamnoides.jpg" alt="Sea Buckthorn, Hippophae rhamnoides"><span class="gallery-caption"><strong>Sea Buckthorn</strong><span class="gallery-title">Hippophae rhamnoides</span><span class="gallery-description">Orange berries · Vitamin C and antioxidant research</span></span>';
document.querySelector('.gallery-grid').appendChild(seaBuckthornCard);
const opuntiaCard = document.createElement('button');
opuntiaCard.className = 'gallery-card gallery-photo-card';
opuntiaCard.type = 'button';
opuntiaCard.dataset.galleryCategory = 'Medicinal Plants';
opuntiaCard.dataset.galleryTitle = 'Prickly Pear (Opuntia spp.)';
opuntiaCard.dataset.galleryCaption = 'Medicinal Plants · Opuntia spp.';
opuntiaCard.dataset.galleryDescription = 'Scientific name: Opuntia spp. Local name: Prickly pear / Nagphani. Cactus is a spiny, drought-resistant plant with flat, fleshy green pads and colorful fruits. It grows mainly in dry and semi-arid regions. Traditionally, some Opuntia species have been used for digestive problems, inflammation, and wound care.';
opuntiaCard.innerHTML = '<img class="gallery-photo" src="images/Opuntia spp.jpg" alt="Prickly pear cactus, Opuntia species"><span class="gallery-caption"><strong>Prickly Pear</strong><span class="gallery-title">Opuntia spp. · Nagphani</span><span class="gallery-description">Drought-resistant cactus · Traditional plant uses</span></span>';
document.querySelector('.gallery-grid').appendChild(opuntiaCard);
const alliumSerraCard = document.createElement('button');
alliumSerraCard.className = 'gallery-card gallery-photo-card';
alliumSerraCard.type = 'button';
alliumSerraCard.dataset.galleryCategory = 'Medicinal Plants';
alliumSerraCard.dataset.galleryTitle = 'Sierra Onion (Allium serra)';
alliumSerraCard.dataset.galleryCaption = 'Medicinal Plants · Allium serra';
alliumSerraCard.dataset.galleryDescription = 'Scientific name: Allium serra. Local name: Sierra onion / Wild onion. Sierra onion is a small perennial wild plant with narrow, grass-like green leaves and underground bulbs. It produces small flowers, usually pinkish to white, and grows naturally in dry mountain and woodland areas. Traditionally, wild onions of the Allium genus have been used as food and for their antimicrobial and antioxidant properties.';
alliumSerraCard.innerHTML = '<img class="gallery-photo" src="images/Allium serra.jpg" alt="Sierra onion, Allium serra"><span class="gallery-caption"><strong>Sierra Onion</strong><span class="gallery-title">Allium serra · Wild onion</span><span class="gallery-description">Perennial bulb plant · Traditional food and plant uses</span></span>';
document.querySelector('.gallery-grid').appendChild(alliumSerraCard);
const chivesCard = document.createElement('button');
chivesCard.className = 'gallery-card gallery-photo-card';
chivesCard.type = 'button';
chivesCard.dataset.galleryCategory = 'Medicinal Plants';
chivesCard.dataset.galleryTitle = 'Chives (Allium schoenoprasum L.)';
chivesCard.dataset.galleryCaption = 'Medicinal Plants · Allium schoenoprasum L.';
chivesCard.dataset.galleryDescription = 'Scientific name: Allium schoenoprasum L. Local name: Chives / Chhoti Pyaz. Chives are a perennial herb with slender green leaves and round purple flowers. Traditionally, the plant is used for its antioxidant, antimicrobial, and anti-inflammatory properties. It has also been studied for potential benefits related to hypertension and digestive health.';
chivesCard.innerHTML = '<img class="gallery-photo" src="images/Allium schoenoprasum .jpg" alt="Chives, Allium schoenoprasum"><span class="gallery-caption"><strong>Chives</strong><span class="gallery-title">Allium schoenoprasum L. · Chhoti Pyaz</span><span class="gallery-description">Purple flowers · Traditional and research uses</span></span>';
document.querySelector('.gallery-grid').appendChild(chivesCard);
const buteaCard = document.createElement('button');
buteaCard.className = 'gallery-card gallery-photo-card';
buteaCard.type = 'button';
buteaCard.dataset.galleryCategory = 'Medicinal Plants';
buteaCard.dataset.galleryTitle = 'Palash (Butea monosperma (Lam.) Kuntze)';
buteaCard.dataset.galleryCaption = 'Medicinal Plants · Butea monosperma';
buteaCard.dataset.galleryDescription = 'Local name: Palash, Dhak, Tesu. Scientific name: Butea monosperma (Lam.) Kuntze. Palash is an important medicinal and multipurpose tree traditionally used in Ayurveda. Its bark, seeds, flowers, and leaves are used for conditions such as diarrhea, intestinal worms, wounds, ulcers, and skin disorders. It is also valued for its natural orange-red dye, gum, timber, and cultural importance.';
buteaCard.innerHTML = '<img class="gallery-photo" src="images/Butea monosperma (Lam.) Kuntze.jpg" alt="Palash tree, Butea monosperma"><span class="gallery-caption"><strong>Palash</strong><span class="gallery-title">Butea monosperma · Dhak · Tesu</span><span class="gallery-description">Ayurvedic tree · Dye, gum, timber, and cultural value</span></span>';
document.querySelector('.gallery-grid').appendChild(buteaCard);
const artemisiaCard = document.querySelector('[data-gallery-title="Artemisia annua microscopic trichomes"]');
if (artemisiaCard) {
  artemisiaCard.dataset.galleryTitle = 'Fern (Pteridophyta)';
  artemisiaCard.dataset.galleryCaption = 'Microscopic Images · Pteridophyta';
  artemisiaCard.dataset.galleryDescription = 'Local name: Fern / locally varies by species. Scientific name: Pteridophyta (fern group; exact species cannot be identified from this image alone). Importance: Ferns are important non-flowering vascular plants and are useful for studying plant anatomy, water transport, photosynthesis, and spore reproduction.';
  artemisiaCard.classList.add('gallery-photo-card');
  artemisiaCard.innerHTML = '<img class="gallery-photo" src="images/Pteridophyta.jpg" alt="Fern, Pteridophyta"><span class="gallery-caption"><strong>Fern</strong><span class="gallery-title">Pteridophyta · Fern group</span><span class="gallery-description">Plant anatomy · Water transport · Spore reproduction</span></span>';
}
const plantCellTissueCard = document.createElement('button');
plantCellTissueCard.className = 'gallery-card gallery-photo-card';
plantCellTissueCard.classList.add('plant-cell-tissue-card');
plantCellTissueCard.type = 'button';
plantCellTissueCard.dataset.galleryCategory = 'Microscopic Images';
plantCellTissueCard.dataset.galleryTitle = 'Plant epidermal cells';
plantCellTissueCard.dataset.galleryCaption = 'Microscopic Images · Plant epidermis';
plantCellTissueCard.dataset.galleryDescription = 'Image: Microscopic view of plant epidermal cells. Local name: Plant cell tissue / epidermis. Scientific name: Plant epidermis (exact plant species cannot be identified from this image alone). Importance: The epidermis forms the plant’s protective outer layer and helps reduce water loss, protect against environmental damage, and regulate gas exchange.';
plantCellTissueCard.innerHTML = '<img class="gallery-photo" src="images/Plant cell tissue.jpg" alt="Microscopic view of plant epidermal cells"><span class="gallery-caption"><strong>Plant epidermis</strong><span class="gallery-title">Plant cell tissue</span><span class="gallery-description">Protective outer layer · Gas exchange</span></span>';
document.querySelector('.gallery-grid').appendChild(plantCellTissueCard);
document.querySelector('[data-gallery-filter="Scientific Discoveries"]')?.remove();
document.querySelector('[data-gallery-title="Reading the evidence"]')?.remove();
document.querySelectorAll('[data-gallery-filter="Researchers & Experiments"], [data-gallery-filter="Nature"], [data-gallery-filter="Natural Compounds"]').forEach((tab) => tab.remove());
document.querySelectorAll('[data-gallery-filter]').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelector('.phase3-tab.active').classList.remove('active');
  tab.classList.add('active');
  const filter = tab.dataset.galleryFilter;
  document.querySelectorAll('.gallery-card').forEach((card) => {
    card.hidden = filter !== 'All' && card.dataset.galleryCategory !== filter;
  });
}));
document.querySelectorAll('.gallery-card').forEach((card) => card.addEventListener('click', () => {
  document.querySelector('#lightbox-title').textContent = card.dataset.galleryTitle;
  document.querySelector('#lightbox-caption').textContent = card.dataset.galleryCaption;
  document.querySelector('#lightbox-description').textContent = card.dataset.galleryDescription;
  openModal(lightboxModal);
}));
document.querySelector('[data-lightbox-share]').addEventListener('click', () => window.alert('Gallery link copied for sharing.'));
document.querySelector('[data-lightbox-download]').addEventListener('click', () => window.alert('High-resolution download will be available when the gallery connects to asset storage.'));

const naturalDrugsMatterCard = document.querySelector('#knowledge .knowledge-card');
if (naturalDrugsMatterCard) {
  naturalDrugsMatterCard.querySelector(':scope > p:not(.knowledge-more)').textContent = 'Nature has been a source of health-related knowledge for thousands of years. Plants, fungi, microorganisms, and other natural resources contain diverse substances that have attracted scientific interest. Studying these natural sources can help researchers understand traditional practices, discover biologically active compounds, and generate new research questions. Natural products do not automatically become medicines, but they can provide valuable starting points for responsible scientific investigation.';
}
const medicinalPlantsCard = [...document.querySelectorAll('#knowledge .knowledge-card')].find((card) => card.querySelector('h3')?.textContent.trim() === 'What are medicinal plants?');
if (medicinalPlantsCard) {
  medicinalPlantsCard.querySelector(':scope > p:not(.knowledge-more)').textContent = 'Medicinal plants are plants that have been traditionally used for health-related purposes or have been investigated scientifically for their biological properties. Studying a medicinal plant involves more than simply knowing its name or traditional use. Researchers may examine its species, chemical composition, preparation, biological activity, safety, and existing evidence. Understanding the plant in its cultural and ecological context helps connect traditional knowledge with modern scientific research.';
}
const naturalCompoundsCard = [...document.querySelectorAll('#knowledge .knowledge-card')].find((card) => card.querySelector('h3')?.textContent.trim() === 'What are natural compounds?');
if (naturalCompoundsCard) {
  naturalCompoundsCard.querySelector(':scope > p:not(.knowledge-more)').textContent = 'Natural compounds are chemical substances produced by living organisms such as plants, fungi, and microorganisms. Some of these molecules have biological activities that make them interesting subjects for scientific research. Researchers study their structures, properties, mechanisms, and potential applications. Exploring natural compounds can expand our understanding of nature and may help identify promising directions for future research and drug discovery.';
}
const knowledgeGrid = document.querySelector('#knowledge .knowledge-grid');
document.querySelectorAll('#knowledge .knowledge-card').forEach((card) => {
  const title = card.querySelector('h3')?.textContent.trim().toLowerCase();
  if (['from discovery to medicine', 'traditional knowledge vs evidence', 'why research matters', 'how are substances studied?'].includes(title)) card.remove();
});
if (knowledgeGrid && ![...knowledgeGrid.querySelectorAll('h3')].some((heading) => heading.textContent.trim() === 'How Are Substances Studied?')) {
  knowledgeGrid.insertAdjacentHTML('beforeend', '<article class="knowledge-card"><span class="knowledge-icon">◌</span><h3>How Are Substances Studied?</h3><p>Scientific investigation of a natural substance usually begins with observation, identification, and careful collection of information. Researchers may then prepare extracts, isolate compounds, and study their properties using controlled laboratory methods. Further research can investigate biological activity, possible mechanisms, safety, and reproducibility. A laboratory observation is only one step in the research process, and stronger conclusions require appropriate evidence from progressively rigorous studies.</p><button class="learn-more" type="button">Learn more +</button><p class="knowledge-more">Scientific investigation of a natural substance usually begins with observation, identification, and careful collection of information. Researchers may then prepare extracts, isolate compounds, and study their properties using controlled laboratory methods. Further research can investigate biological activity, possible mechanisms, safety, and reproducibility. A laboratory observation is only one step in the research process, and stronger conclusions require appropriate evidence from progressively rigorous studies.</p></article>');
}
document.querySelectorAll('.learn-more').forEach((button) => button.addEventListener('click', () => {
  const card = button.closest('.knowledge-card');
  card.classList.toggle('open');
  button.textContent = card.classList.contains('open') ? 'Show less −' : 'Learn more +';
}));

const assistantResponses = {
  'Summarize Curcumin anti-inflammatory pathways': '<strong>Key takeaway:</strong> Curcumin research commonly investigates inflammatory signaling pathways including NF-κB and related cytokine activity. <br /><br /><strong>Context:</strong> Results vary by model, formulation, and dose. Laboratory findings do not establish clinical effectiveness.',
  'Compare Ginkgo biloba flavonoids': '<strong>Key takeaway:</strong> Ginkgo flavonoids are a chemically diverse group with antioxidant activity studied across multiple experimental models. <br /><br /><strong>Context:</strong> Comparisons depend on extraction method, constituent ratios, and study design.',
  'Analyze Taxol chemical structure': '<strong>Key takeaway:</strong> Paclitaxel has a complex diterpenoid scaffold whose shape supports interaction with tubulin. <br /><br /><strong>Context:</strong> Structural analysis can explain a mechanism of action, but cannot predict an individual treatment outcome.',
  'Map traditional uses of Reishi': '<strong>Key takeaway:</strong> Reishi has a long history of traditional use, while contemporary studies investigate polysaccharides and triterpenes. <br /><br /><strong>Context:</strong> Traditional use and laboratory evidence are distinct knowledge categories and should be reported separately.'
};
document.querySelectorAll('.prompt-pill').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('.prompt-pill.active').classList.remove('active');
  button.classList.add('active');
  document.querySelector('#ai-question').textContent = button.dataset.prompt;
  document.querySelector('#ai-response').innerHTML = assistantResponses[button.dataset.prompt];
}));

document.querySelector('#contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#contact-success').hidden = false;
  event.currentTarget.reset();
});
document.querySelector('#newsletter-form').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#newsletter-success').hidden = false;
  document.querySelector('#newsletter-email').value = '';
});

const revealItems = document.querySelectorAll('.reveal');
const informationPanel = document.querySelector('#information .information-panel');
if (informationPanel) {
  informationPanel.insertAdjacentHTML('afterend', `<div class="traditional-faq"><p class="eyebrow">People often ask about</p><h3>Traditional knowledge &amp; natural medicine</h3><div class="faq-list"><details><summary>1. What is traditional knowledge?</summary><p>Traditional knowledge is the wisdom and practices passed from one generation to another.</p></details><details><summary>2. Why should we explore traditional remedies?</summary><p>They may contain useful knowledge about plants, mushrooms, and other natural resources that can guide scientific research.</p></details><details><summary>3. Can traditional remedies help modern medicine?</summary><p>Yes. Some traditional remedies have provided ideas for developing or studying modern medicines.</p></details><details><summary>4. Why are medicinal plants important?</summary><p>Many plants contain natural compounds that may have useful biological properties.</p></details><details><summary>5. Why should scientists test traditional remedies?</summary><p>Scientific testing helps determine whether a traditional claim is effective and safe.</p></details><details><summary>6. Can traditional knowledge help discover new medicines?</summary><p>Yes, it can provide researchers with leads for investigating potentially useful natural compounds.</p></details><details><summary>7. Why should we document traditional knowledge?</summary><p>Documentation helps preserve valuable knowledge that could otherwise be forgotten.</p></details><details><summary>8. How can technology help explore traditional knowledge?</summary><p>AI, drones, digital databases, and laboratory tools can help researchers identify, document, and study natural resources.</p></details><details><summary>9. Is every traditional remedy safe?</summary><p>No. Natural does not always mean safe. Proper identification, laboratory testing, and expert guidance are important.</p></details><details><summary>10. What is the main goal of exploring traditional knowledge?</summary><p>The goal is to <strong>preserve valuable knowledge and scientifically investigate natural resources for possible future health and medical applications</strong>.</p></details></div></div>`);
}
const contactCards = document.querySelectorAll('#contact .info-card');
if (contactCards.length >= 3) {
  contactCards[0].innerHTML = '<small>Location</small><strong>Gilgit Baltistan, Skardu</strong>';
  contactCards[1].innerHTML = '<small>Contact number</small><a href="tel:0355442563">0355442563</a>';
  contactCards[2].innerHTML = '<small>Email</small><a href="mailto:amir.irfan5252@gmail.com">amir.irfan5252@gmail.com</a>';
}
const mapPreview = document.querySelector('.map-preview');
if (mapPreview) {
  mapPreview.outerHTML = '<a class="map-preview" href="https://www.google.com/maps/search/?api=1&amp;query=Gilgit-Baltistan%2C%20Pakistan" target="_blank" rel="noopener noreferrer" role="img" aria-label="Open Gilgit-Baltistan, Pakistan in Google Maps"><span class="map-pin"></span></a>';
}
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const pageRoutes = {
  home: ['.hero', '#research', '#information', '.stats-section', '.featured-section', '.phase2-section', '#nature-gallery', '#knowledge', '#assistant', '#about-mission', '#contact', '.newsletter-section', '#research-approach'],
  research: ['#research'],
  gallery: ['#nature-gallery'],
  information: ['#information', '#knowledge'],
  about: ['#about-mission', '#research-approach'],
  contact: ['#contact', '.newsletter-section']
};

function showPage(hash = window.location.hash) {
  const routeName = hash.slice(1) || 'home';
  const aliases = {
    'nature-gallery': 'gallery',
    knowledge: 'information',
    'about-mission': 'about',
    'contact-us': 'contact'
  };
  const pageName = aliases[routeName] || routeName;
  const visibleSelectors = pageRoutes[pageName] || pageRoutes.home;

  document.querySelectorAll('main > *').forEach((section) => {
    section.hidden = !visibleSelectors.some((selector) => section.matches(selector));
  });
  document.querySelectorAll('.desktop-links a, .mobile-menu a').forEach((link) => {
    const linkRoute = aliases[link.getAttribute('href').slice(1)] || link.getAttribute('href').slice(1);
    link.classList.toggle('active', linkRoute === pageName);
  });
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', () => showPage());
showPage();
