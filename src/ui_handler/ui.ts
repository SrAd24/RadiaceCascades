import {Pane} from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js';

let brushSize = 10;
let cascades = 4;
let color = {r: 255, g: 255, b: 255};
let intervals = 10;

const pane = new Pane({
    container: document.getElementById('UI')
});

const pane2 = new Pane({
    container: document.getElementById('Person')
});

const ParamsF = {
    Color: {r: 255, g: 255, b: 255},
    Intervals: 10,
    Cascades: 4,
    BrushSize: 10
}

const colorState = pane.addBinding(ParamsF, "Color", {
    label: "Color"
});

const brushSizeState = pane.addBinding(ParamsF, "BrushSize", {
    label: "Brush Size",
    min: 0,
    max: 40,
    step: 0.1
});

const cascadesState = pane.addBinding(ParamsF, "Cascades", {
    label: "Cascades",
    min: 0,
    max: 8,
    step: 1
});

const intervalsState = pane.addBinding(ParamsF, "Intervals", {
    label: "Intervals",
    min: 0,
    max: 50,
    step: 1
});

const saveButton = pane.addButton({
    title: "Save Artwork"
});

const t1 = pane2.addTab({
    pages: [
        {title: "Profile"},
        {title: "Search"},
        {title: "Social"},
    ],
});

// Debug tab structure
setTimeout(() => {
    console.log('=== TAB DEBUG ===');
    const personPanel = document.querySelector('#Person');
    console.log('Person panel:', personPanel);
    
    const allTabElements = personPanel.querySelectorAll('[class*="tab"]');
    console.log('All tab-related elements:', allTabElements.length);
    allTabElements.forEach((el, i) => {
        console.log(`Element ${i}:`, el.className, el.textContent, el);
    });
    
    const tabContainer = personPanel.querySelector('.tp-tabv');
    console.log('Tab container:', tabContainer);
    if (tabContainer) {
        console.log('Tab container children:', tabContainer.children);
        Array.from(tabContainer.children).forEach((child, i) => {
            console.log(`Child ${i}:`, child.className, child.textContent, child);
        });
    }
    
    const buttons = personPanel.querySelectorAll('button');
    console.log('All buttons:', buttons.length);
    buttons.forEach((btn, i) => {
        console.log(`Button ${i}:`, btn.className, btn.textContent, btn);
    });
}, 500);

const ParamsT = {
    UserName: "User name",
    UserID: "User id",
    Search: ""
}

// Profile Tab
const changePhotoButton = t1.pages[0].addButton({
    title: "Change Avatar"
});

const userName = t1.pages[0].addBinding(ParamsT, "UserName", {
    label: "Username",
    readonly: true
});
userName.element.id = "user_name_tweak_pane";

const userId = t1.pages[0].addBinding(ParamsT, "UserID", {
    label: "User ID",
    readonly: true
});

const showButton = t1.pages[0].addButton({
    title: "My Artworks"
});

const logOutButton = t1.pages[0].addButton({
    title: "Logout"
});

// Search Tab
const searchInfo = t1.pages[1].addBinding(ParamsT, "Search", {
    label: "Find User"
});
const searchButton = t1.pages[1].addButton({
    title: "Search Now"
});

// Social Tab
const showFriendsButton = t1.pages[2].addButton({
    title: "My Friends"
});

const showFriendsRequestButton = t1.pages[2].addButton({
    title: "Friend Requests"   
});

// Styles
const tweakpaneStyles = document.createElement('style');
tweakpaneStyles.textContent = `
.tp-btnv {
    width: 100% !important;
}


`;
document.head.appendChild(tweakpaneStyles);



const photo = changePhotoButton.controller.view.element;
photo.style = `width: 95%; height: 400px; border: 2px solid rgba(100, 200, 255, 0.5); border-radius: 15px; margin: 10px 2.5%; background: linear-gradient(135deg, rgba(20, 20, 40, 0.8), rgba(40, 40, 80, 0.8)); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);`;
photo.id = "photo";
photo.style.backgroundSize = 'cover';
photo.style.backgroundPosition = 'center';
photo.style.transition = 'all 0.3s ease';

// Handling states
cascadesState.on('change', (event) => {
    cascades = event.value;
});

intervalsState.on('change', (event) => {
    intervals = event.value;

});

showFriendsRequestButton.on('click', (e) => {
    console.log(123);
    document.querySelector('#show_friend_requests_button').click();
});

showFriendsButton.on('click', (e) => {
    document.querySelector('#show_friends_button').click();
})

colorState.on('change', (event) => {
    color = event.value;
});

brushSizeState.on('change', (event) => {
    brushSize = event.value;
});

saveButton.on("click", () => {
    document.querySelector('#save_works_form').style.display = "block";
});

searchButton.on("click", () => {
    document.querySelector('#useridSearch').value = searchInfo.controller.value.value_.rawValue_;
    const submitSearch = document.querySelector('#_Isearchbutton');
    submitSearch.click();
});

showButton.on("click", () => {
    document.querySelector('#get_works_button').click();
});

logOutButton.on("click", () => {
    window.location.href = '../../back/q.php';
});

changePhotoButton.on("click", () => {
	const pic_input = document.querySelector('#_Ipic');
    pic_input.click()
});

const pic_input = document.querySelector('#_Ipic');
pic_input?.addEventListener('change', () => {
    const pic_button = document.querySelector('#_Ipicbutton');
    pic_button?.click();
});

const  getValue = ()=> {
  return  {
		cas: cascades,
		int: intervals,
		col: color,
		bs: brushSize,
	}
}

document.querySelector('#save_work_button')?.addEventListener('click', (e) => {   
    e.preventDefault();

    const workData = document.querySelector('#image');
    const canvas = document.getElementById('The_only_normal_group_for_the_entire_time_at_the_CGSG').toDataURL('image/png', 1.0);
    workData.value = canvas;

    document.querySelector('#save_work_button_hidden').click();
});


export {cascades, intervals, color, brushSize, getValue, userId};
