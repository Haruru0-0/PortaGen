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

export const createPortfolio = async (portfolioName?: string, bio?: string) => {
  try {
    const response = await fetch("/api/portfolio/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ portfolioName, bio }),
    });
    if (!response.ok) throw new Error("Failed to create portfolio");
    return await response.json();
  } catch (error) {
    console.error("Failed to create portfolio:", error);
  }
};

export const deletePortfolio = async (id: number) => {
  try {
    const response = await fetch(`/api/portfolio/delete?id=${id}`, { method: "DELETE" });
    return response.ok;
  } catch (error) {
    console.error("Failed to delete portfolio:", error);
    return false;
  }
};

export const getPortfolioInfo = async (portfolioId: number) => {
  try {
    const response = await fetch(`/api/portfolio/get?portfolioId=${portfolioId}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch portfolio info:", error);
  }
  return null;
};

export const updatePortfolioInfo = async (
  portfolioId: number,
  data: { portfolioName?: string; bio?: string }
) => {
  try {
    const response = await fetch("/api/portfolio/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ portfolioId, ...data }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Failed to update portfolio info:", error);
  }
  return null;
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
