export interface IResume {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    experience: string;
    resume: {
        url: string;
        public_id: string;
        hashKey: string;
    },
    linkedInUrl: string;
    gitHubUrl: string;
    portfolioUrl: string;
    education: string;
    aiSummary: string;
    role: string;
}