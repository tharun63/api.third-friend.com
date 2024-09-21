import { Request, Response, NextFunction, response } from "express";
import { JourneyDataServiceProvider} from "../services/database/journey";
import { CustomError } from "../interfaces/customError";
import filtersHelper from "../helpers/filterHelper";
import paginationHelper from "../helpers/paginationHelpers";

// interfaces
import { AuthRequest } from "../interfaces/authRequest";



const journeyDataServiceProvider = new JourneyDataServiceProvider();

export class JourneyController {  


    public async AddJourney(req: Request, res: Response, next: NextFunction) {
        try {
    
          let journeyData = req.body;
        //   journeyData.user = req.user._id;
    
          const exists = await journeyDataServiceProvider.journeyExists({
            user:journeyData.user,
            journey_begins_on:journeyData.journey_begins_on
          });
    
          if (exists) {
            const err = new CustomError();
            err.status = 409;
            err.message = "Journey with this is already existed at the same time";
            throw err;
          }         
    
          let savedJourney: any = await journeyDataServiceProvider.saveJourney(journeyData);
    
    
          return res.status(201).json({
            success: true,
            message: "Journey Registered  Successfully!",
            data: savedJourney
          });
        } catch (err) {
          next(err);
        }
      }

  public async updateJourney(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      let journey = req.body;
      
      await journeyDataServiceProvider.updateJourneyById(req.params.journey_id, journey);

      return res.status(200).json({
        success: true,
        message: "Journey updated successfully",
      });
    } catch (error) {
      let respData = {
        success: false,
        message: error.message,
      };
      return res.status(error.statusCode || 500).json(respData);
    }
  }

  public async getJourneyById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      let data = await journeyDataServiceProvider.getJourneyById(
        req.params.journey_id,
      );

      return res.status(200).json({
        success: true,
        message: "Journey data fetched successfully",
        data: data,
      });
    } catch (error) {
      return next(error);
    }
  }


  public async getAllJourneys(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      let { skip, limit, sort, projection } = req.parsedFilterParams;
      let { query = {} } = req.parsedFilterParams;

      query = filtersHelper.journeys(query, req.query);
      sort.updated_at = -1;

      projection = {
        first_name: 1,
        last_name: 1,
        status: 1,
        username: 1,
        user_type: 1,
      };

      const [journeys = [], count = 0] = await Promise.all([
        journeyDataServiceProvider.getAllJourneys({ query, skip, limit, sort, projection, }),
        journeyDataServiceProvider.countAllJourneys(query),
      ]);

      const response = paginationHelper.getPaginationResponse({
        page: req.query.page || 1,
        count,
        limit,
        skip,
        data: journeys,
        message: "All Journeys fetched successfully",
        searchString: req.query.search_string,
      });

      return res.json(response);
    } catch (err) {
      return err;
    }
  }

  public async deleteJourney(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { journey_id: journeyId } = req.params;
      let journeyData: any = await journeyDataServiceProvider.getJourneyById(journeyId);


      await journeyDataServiceProvider.updateJourneyById(journeyId, {
        journey_status: "ARCHIVED",
        deleted_on: new Date(),
      });

      return res.status(200).json({
        success: true,
        message: "Journey deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  
}
