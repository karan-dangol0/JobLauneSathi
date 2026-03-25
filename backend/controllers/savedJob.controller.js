import SavedJob from "../models/SavedJob.js";

// @desc    Save a job
export const saveJob = async (req, res) => {
  try {
    const exists = await SavedJob.findOne({
      job: req.params.jobId,
      jobSeeker: req.user._id,
    });

    if (exists) {
      return res.status(400).json({ message: "Job already saved" });
    }

    await SavedJob.create({
      job: req.params.jobId,
      jobSeeker: req.user._id,
    });

    res.status(201).json({ message: "Job saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save job", error: err.message });
  }
};

// @desc    Unsave a job
export const unsaveJob = async (req, res) => {
  try {
    const result = await SavedJob.findOneAndDelete({
      job: req.params.jobId,
      jobSeeker: req.user._id,
    });

    if (!result) {
      return res.status(404).json({ message: "Saved job not found" });
    }

    res.status(200).json({ message: "Job removed from saved list" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove saved job", error: err.message });
  }
};

// @desc    Get saved jobs for current user
export const getMySavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ jobSeeker: req.user._id }).populate({path: "job", populate: {path: "company", select: "name companyName companyLogo"}});

    res.status(200).json(savedJobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch saved jobs", error: err.message });
  }
};
