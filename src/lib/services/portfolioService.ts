
export const saveData = async (endpoint: string, data: any) => {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to save data to ${endpoint}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to save data to ${endpoint}:`, error);
  }
};

export const fetchPortfolioData = async (portfolioId: number) => {
  try {
    const response = await fetch(`/api/portfolio?id=${portfolioId}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch portfolio data:", error);
  }
};

export const fetchPortfolios = async () => {
  try {
    const response = await fetch("/api/portfolio/list");
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch portfolios:", error);
  }
};

export const deleteIcon = async (id: number) => {
  try {
    const response = await fetch(`/api/icons?id=${id}`, { method: "DELETE" });
    return response.ok;
  } catch (error) {
    console.error("Failed to delete icon:", error);
    return false;
  }
};

export const deleteMusic = async (id: number) => {
  try {
    const response = await fetch(`/api/music?id=${id}`, { method: "DELETE" });
    return response.ok;
  } catch (error) {
    console.error("Failed to delete music:", error);
    return false;
  }
};

export const uploadFile = async (
  file: File,
  assetType: string,
  portfolioId: number
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("assetType", assetType);
  formData.append("portfolioId", portfolioId.toString());

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Failed to upload file:", error);
  }
};
