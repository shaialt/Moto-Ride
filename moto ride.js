document.addEventListener("DOMContentLoaded", function () {
    const wrapper = document.querySelector(".subcategory_wrapper_box");
    const content = document.querySelector(".subcategory_3d_box");
    const items = document.querySelectorAll(".subcategory");

    if (wrapper && content && items.length > 0) {
        const wrapperWidth = wrapper.clientWidth;

        // מוצאים את האלמנט האמצעי ביותר
        const middleIndex = Math.floor(items.length / 2);
        const middleItem = items[middleIndex];

        // מחשבים את המיקום של האלמנט האמצעי בתוך התוכן
        const middleItemOffset = middleItem.offsetLeft + (middleItem.offsetWidth / 2);

        // קובעים את הגלילה כך שהאלמנט האמצעי יהיה במרכז
        wrapper.scrollLeft = middleItemOffset - (wrapperWidth / 2);
    }
});
