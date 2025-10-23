
import { VideoCategory } from '../types';

export const videoData: VideoCategory[] = [
    {
        id: 'cat-1',
        title: "Knife Skills",
        videos: [
            {
                id: 'video-1-1',
                title: "How to Chop an Onion",
                description: "Learn the proper technique for dicing an onion quickly and safely, without the tears.",
                thumbnailUrl: "https://images.unsplash.com/photo-1508254592095-aff38a9b2b58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
                videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
            },
            {
                id: 'video-1-2',
                title: "Mastering the Mince",
                description: "Finely mince garlic and herbs like a pro with this simple, efficient method.",
                thumbnailUrl: "https://images.unsplash.com/photo-1622206537842-a871235141d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
                videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
            }
        ]
    },
    {
        id: 'cat-2',
        title: "Cooking Basics",
        videos: [
            {
                id: 'video-2-1',
                title: "How to Perfectly Boil Pasta",
                description: "Never have mushy or undercooked pasta again. Learn the key steps to achieve perfect al dente pasta every time.",
                thumbnailUrl: "https://images.unsplash.com/photo-1621996346565-e326e7e24c6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
                videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
            },
            {
                id: 'video-2-2',
                title: "The Secret to Searing Meat",
                description: "Get that beautiful, flavorful crust on your steaks and other meats by mastering the art of the sear.",
                thumbnailUrl: "https://images.unsplash.com/photo-1606511122324-a7b33a042e88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
                videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
            },
             {
                id: 'video-2-3',
                title: "How to Make a Simple Vinaigrette",
                description: "Whip up a delicious and versatile salad dressing from scratch in just a few minutes.",
                thumbnailUrl: "https://images.unsplash.com/photo-1540420773420-2850a43f0716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
                videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
            }
        ]
    }
];